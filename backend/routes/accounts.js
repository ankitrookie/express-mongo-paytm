const mongoose = require("mongoose");
const { Router } = require("express")
const router = Router();

const { authMiddleware } = require('../middleware/middleware');
const { Account } = require("../db")

router.get('/balance', authMiddleware, async (req, res) => {
  const { userId } = req;

  const balance = await Account.findOne({
    userId
  });

  res.json({
    balance: balance.balance
  })
});

router.post('/transfer', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { to, amount } = req.body;
  const { userId } = req;
  const account = await Account.findOne({ userId: userId }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficent balance"
    })
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    })
  }

  await Account.updateOne(
    {
      userId: req.userid
    },
    {
      $inc: { balance: -amount }
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: to
    },
    {
      $inc: { balance: amount }
    }
  ).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful"
  });

})

module.exports = router 
