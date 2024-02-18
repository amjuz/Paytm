const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account, User } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
})

router.post('/transfer',authMiddleware, async (req, res) => {

    const { amount, to } = req.body;

    const fromAccount = await Account.findOne({
        userId: req.userId
    });
    

    if (!fromAccount || fromAccount.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance/account balance not found"
        })
    };

    const toAccount = await Account.findOne({ 
        userId: to
    })

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({
        userId: fromAccount.userId
    }, {
        $inc: {
            balance: -amount
        }
    });

    await Account.updateOne({
        userId: toAccount.userId
    }, {
        $inc : {
            balance: amount
        }
    })
  

    res.json({
        message: "Transaction successful"
    });
})


module.exports = router;
