const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');


// signup route

const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string(), 
    password: zod.string()
})

router.post("/signup",async(req,res)=>{

    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            message : 'username already taken / incorrect inputs'
        })
    }

    const userExists = await User.findOne({
        username : body.username
    })

    if(userExists){
        return res.json({
            message: 'Email already taken/ incorrect inputs'
        })
    }

    const dbUser = await User.create(body);
    const userId = (await dbUser)._id;

    await Account.create({
        userId,
        balance: 1 + Math.floor(Math.random() * 10000)
    });

    const token = jwt.sign({
        userId 
    },JWT_SECRET);

    res.json({
        message: "user created successfully",
        token: token
    });
       
})

// update route

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName:zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/update", authMiddleware, async (req,res)=>{

    const body = req.body;

    const {success} = updateSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({_id: req.userId},body)

    res.status(200).json({
    message: "updated successfully"
    })

})

//sign in route
const signInSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

router.post('/signin', async (req,res)=>{  
    
    const {username , password} = req.body;

    const {success} = signInSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message : "invalid inputs"
        });
    }
    
    const userFound = await User.findOne({
        username,
        password
    });

    if(userFound) {
        const token = jwt.sign({
            userId: userFound._id
        },JWT_SECRET);

        return res.status(200).json({
            token : token
        })
    }
    else {
        return res.status(411).json({
            message: "username / password doesn't exists, please signup first"
        });
    }
    
})

// filter route

router.get('/bulk', async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName: {
                "$regex": filter
            }},{
                lastName: {
                    "$regex": filter
                }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = router;
