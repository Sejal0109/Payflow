const express = require("express");
const userRouter = require("./user");
const transactionRouter = require("./transaction");
const router = express.Router();

router.use("/user", userRouter);

router.use("/transaction", transactionRouter);

module.exports = router;