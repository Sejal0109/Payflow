import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma, { RampStatus } from "@aditya0257/payflow-common";

const app = express();
app.use(cors());
app.use(express.json());
const port = 7072;

app.post("/onRampBankWebhook", async (req, res) => {
  // TODO: bank should ideally send us a secret so we know this is sent by them
  // bwsToken => bankWebhookSecretToken
  console.log("Request came here");

  const bwsTokenHeader =
    req.headers["bwsToken"] ||
    req.headers["bwstoken"] ||
    req.headers["BWSTOKEN"];
  if (!bwsTokenHeader) {
    return res.status(400).json({
      success: false,
      message: "Missing bwsToken header",
    });
  }

  let bwsToken: string;

  if (Array.isArray(bwsTokenHeader)) {
    if (!bwsTokenHeader[0]) {
      return res.status(400).json({
        success: false,
        message: "Missing bwsToken header in array",
      });
    }

    bwsToken = bwsTokenHeader[0];
  } else bwsToken = bwsTokenHeader;

  const paymentInformation = {
    bwsToken,
    onRampToken: req.body.onRampToken,
    amount: Number(req.body.amount),
    userId: Number(req.body.userId),
  };

  // verify bwsToken
  // TODO: later use jwt.sign(payload, COMMON_SECRET_BETWEEN_WEBHOOK_BANKSERVER) and here, verify it to get payload with the data

  if (bwsToken !== process.env.BWS_TOKEN_VAL) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized Request",
    });
  }

  // Check if the onRampTransaction is already marked as Success
  const existingTransaction = await prisma.onRampTransaction.findUnique({
    where: {
      token: paymentInformation.onRampToken,
    },
    select: {
      status: true,
    },
  });

  if (
    existingTransaction &&
    existingTransaction.status === RampStatus.Success
  ) {
    return res.status(200).json({
      success: true,
      message: "Already Captured",
    });
  }

  // Transaction required - both need to be done together
  // increment user's wallet balance by amount
  // update the db -> onRamp status -> "Success"

  try {
    await prisma.$transaction(async (tx) => {
      // Lock the balance row for update
      await tx.$executeRaw`
        SELECT * FROM "Balance" 
        WHERE "userId" = ${paymentInformation.userId} 
        FOR UPDATE
      `;

      // increment the balance
      await tx.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount) * 100,
          },
        },
      });

      // Update the onRampTransaction status
      await tx.onRampTransaction.update({
        where: {
          token: paymentInformation.onRampToken,
        },
        data: {
          status: RampStatus.Success,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.get("/*", (req, res) => {
  console.log("in get /* request - for checking bank-webhook service health.");
  res.json({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
