const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const prisma = require("@aditya0257/payflow-common").default;
const { RampStatus } = require("@aditya0257/payflow-common");

const authMiddleware = require("../middleware");

function generateUniqueToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return token;
}

async function getJwtSignedToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn("JWT_SECRET is not defined. JWT token cannot be created.");
    return null;
  }

  try {
    const token = jwt.sign(payload, secret);
    return token;
  } catch (e) {
    console.error("Error signing JWT:", e);
    return null;
  }
}

router.get("/", (req, res) => {
  res.send("Transaction route");
});

router.get("/recentonramp", authMiddleware, async (req, res) => {

  const userId = req.userId;

  const transactions = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      amount: true,
      startTime: true,
      provider: true,
      status: true,
    },
    orderBy: {
      startTime: 'desc', // Order by most recent transactions
    },
    take: 10, // Limit to 10 results
  });


  res.status(200).json({
    success: true,
    message: "Recent onramp transaction fetched.",
    transactions: transactions,
  });


});

router.get("/recentp2p", authMiddleware, async (req, res) => {

  const userId = req.userId;

  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {fromUserId: Number(userId)},
        {toUserId: Number(userId)},
      ],
    },
    include: {
      fromUser: {
        select: {
          name: true,
          number: true,
        },
      },
      toUser: {
        select: {
          name: true,
          number: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 12, 
  });

  const mappedTransactions = transactions.map((transaction) => ({
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    fromUserId: transaction.fromUserId,
    fromUserName: transaction.fromUser?.name, 
    fromUserContactNo: transaction.fromUser?.number,
    toUserId: transaction.toUserId,
    toUserName: transaction.toUser?.name, 
    toUserContactNo: transaction.toUser?.number,
  }));
  

  res.status(200).json({
    success: true,
    message: "Recent p2p transaction fetched.",
    transactions: mappedTransactions,
  });

});


router.post("/startonramp", authMiddleware, async (req, res) => {
  const { provider, amount } = req.body;
  const userId = req.userId;
  // go to prisma and create onRampTransaction entry using onRampToken
  const onRampToken = generateUniqueToken();

  await prisma.onRampTransaction.create({
    data: {
      provider,
      token: onRampToken,
      status: RampStatus.Processing,
      startTime: new Date(),
      amount: amount * 100,
      userId: Number(userId),
    },
  });

  let user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      name: true,
    },
  });
  let name;
  if (!user || !user.name) name = "Anonymous";
  else name = user.name;

  // go to bank server with {userId, name, amount, (also some secret cookie/ jwt preferable for bank to know your verified application)}
  // bank server will return batoken (BankApiToken), usually that contains payload with userId, amount, onRampToken to pass to
  // netbanking.bankservice.com, but here, we will pass {userId, amount, onRampToken} in body + batoken in headers from FE to netbanking service

  // assuming bank server takes 0.5 second to respond with batoken
  // BANK SERVER PROCESSING TIME
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payload = {
    userId: userId,
    amount,
    name: name,
    onRampToken,
  };

  // bank server returns batoken
  const batoken = await getJwtSignedToken(payload);
  if (!batoken) {
    throw new Error("Failed to generate batoken");
  }

  // TODO: return back {userId, amount, onRampToken} payload inside batoken (jwt token),
  // TODO: to FE, then redirect to bank.netbanking.service url.
  // WHY jwt? so that it can carry a payload and can be decoded to get it on the netbanking service FE
  // const data = jwt.verify(batoken, process.env.JWT_SECRET ?? "");
  // or jwt.decode(batoken);
  // console.log(data);

  

  res.status(200).json({
    success: true,
    message: "Started Onramp transaction.",
    batoken: batoken,
  });
});

router.post("/startp2p", authMiddleware, async (req, res) => {
  const from = req.userId;
  const { to, amount } = req.body;

  try {
    // Find the `toUser` from prisma
    const toUser = await prisma.user.findFirst({
      where: {
        number: to,
      },
    });

    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found!",
      });
    }

    // Perform the p2p transaction as an atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Lock the balance row of the fromUser
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(
        from
      )} FOR UPDATE`;

      // Fetch fromUser's balance
      const fromBalance = await tx.balance.findFirst({
        where: {
          userId: Number(from),
        },
      });

      if (!fromBalance || fromBalance.amount < amount * 100) {
        throw new Error("Insufficient funds");
      }

      // Update balances
      await tx.balance.update({
        where: {
          userId: Number(from),
        },
        data: {
          amount: {
            decrement: Number(amount) * 100,
          },
        },
      });

      await tx.balance.update({
        where: {
          userId: Number(toUser.id),
        },
        data: {
          amount: {
            increment: Number(amount) * 100,
          },
        },
      });

      // Create the p2p transfer record
      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: Number(toUser.id),
          timestamp: new Date(),
          amount: Number(amount) * 100,
        },
      });

      return {
        success: true,
        message: "P2P transaction completed successfully.",
      };
    });

    // Send the response if the transaction completes
    res.status(200).json(result);
  } catch (error) {
    // Handle any errors that occurred during the transaction
    res.status(400).json({
      success: false,
      message: error.message || "P2P transaction failed.",
    });
  }
});

router.get("/pagep2p", authMiddleware, async (req, res) => {
  

  const userId = req.userId;

  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: Number(userId) }, { toUserId: Number(userId) }],
    },
    include: {
      fromUser: {
        select: {
          name: true,
          number: true,
        },
      },
      toUser: {
        select: {
          name: true,
          number: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const mappedTransactions = transactions.map((transaction) => ({
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    fromUserId: transaction.fromUserId,
    fromUserName: transaction.fromUser?.name,
    fromUserContactNo: transaction.fromUser?.number,
    toUserId: transaction.toUserId,
    toUserName: transaction.toUser?.name,
    toUserContactNo: transaction.toUser?.number,
  }));

  res.status(200).json({
    success: true,
    message: "Page p2p transactions fetched.",
    transactions: mappedTransactions,
  });
});

router.get("/pageonramp", authMiddleware, async (req, res) => {
  
  const userId = req.userId;
  const transactions = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      amount: true,
      startTime: true,
      provider: true,
      status: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  res.status(200).json({
    success: true,
    message: "Page Onramp transactions fetched.",
    transactions: transactions,
  });
});

module.exports = router;
