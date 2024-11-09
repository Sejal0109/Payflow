const express = require("express");
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");
const prisma = require("@aditya0257/payflow-common").default;

const signupBodySchema = zod.object({
  name: zod.string(),
  number: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  // input validation using zod
  const { success } = signupBodySchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Email already taken / Incorrect inputs",
    });
  }

  // check if user already doesnt exist
  const existingUser = await prisma.user.findUnique({
    where: { number: req.body.number },
  });

  if (existingUser) {
    return res.status(411).json({
      success: false,
      message: "Email already taken/Incorrect inputs",
    });
  }

  // hashing the input password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // creating a new user with balance using transaction -> storing it with its password's hashed form in db

  try {
    const { user, balance } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: req.body.name,
          number: req.body.number,
          password: hashedPassword,
        },
      });

      const balance = await tx.balance.create({
        data: {
          amount: 0,
          locked: 0,
          userId: Number(user.id.toString()),
        },
      });

      return { user, balance };
    });

    // Creating jwt token
    const payload = {
      user_id: user.id,
      user_name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      name: user.name,
      id: user.id,
      number: user.number,
      message: "User created successfully!",
      token: token,
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while creating user on Signup",
    });
  }
});

const signInBody = zod.object({
  number: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Incorrect Inputs",
    });
  }

  // check if user exists in db with given id, if it exists, check if password is same or not
  const user = await prisma.user.findUnique({
    where: { number: req.body.number },
  });

  if (!user) {
    return res.status(411).json({
      success: false,
      message: "Error while logging in",
    });
  }

  const hashedPassword = user.password;
  const match = await bcrypt.compare(req.body.password, hashedPassword);

  if (!match) {
    return res.status(411).json({
      success: false,
      message: "Error while logging in",
    });
  }

  const token = jwt.sign(
    { user_id: user.id, user_name: user.name },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    success: true,
    name: user.name,
    number: user.number,
    id: user.id,
    message: "User logged in successfully.",
    token: token,
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  name: zod.string().optional(),
  number: zod.string().optional(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const balance = await prisma.balance.findUnique({
    where: {
      userId: Number(userId),
    },
    select: {
      amount: true,
      locked: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Returning Balance.",
    totalBalance: (balance?.amount ?? 0) / 100,
    lockedBalance: balance?.locked,
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Error while updating information",
    });
  }

  // If password is provided, hash it before updating
  let updateData = req.body;
  if (req.body.password) {
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(req.body.password, saltRounds);
  }

  await prisma.user.update({
    where: { id: req.userId },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    message: "Updated successfully!",
  });
});

module.exports = router;