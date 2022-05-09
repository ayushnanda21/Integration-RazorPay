require('dotenv').config();
const router = require("express").Router();
const Razorpay = require("razorpay");
const Transaction  = require("./transaction.model");
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');

const keyid  = process.env.KEY_ID;
const keysecret = process.env.KEY_SECRET


//order api
router.post("/order", function(req,res){
    var instance  = new Razorpay({
        key_id : keyid,
        key_secret : keysecret
    });

    //amount is present in smallest currency unit always
    var options = {
        amount : req.body.amount,
        currency : "INR",
        receipt : uuidv4(),
        payment_capture : 1  //for automatic payment capture
    }

    instance.orders.create(options, function(err, order){
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(201).json(order);
        }
    })
});

//payment endpoint for saving values in db iffff signature of razorpay === HMAC hex digest
router.post("/payment", function(req,res){
    const generated_signature = crypto.createHmac('sha256', process.env.KEY_SECRET)
    generated_signature.update(req.body.razorpay_order_id + "|" + req.body.transactionid);
    if(generated_signature.digest('hex') === req.body.razorpay_signature){
        const transaction = new Transaction({
            transactionid : req.body.transactionid,
            transactionamount : req.body.transactionamount
        });
        transaction.save((err,savedtransac)=>{
            if(err){
                res.status(500).json("Some issue occurred")
            }

            res.status(200).json({transaction : savedtransac})
        })
    }
    else{
        return res.status(400).json("Failed")
    }
}) 
module.exports = router;