const { Router } = require("express");
const router = Router();

const { validationSchemaSignin, validationSchemaSignup, updateValidationSchema } = require("../types");
const { User, Account } = require("../db");

const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

const { authMiddleware } = require("../middleware/middleware");

router.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const { success } = validationSchemaSignup.safeParse({ username, password, firstName, lastName});

  if(!success){
    res.status(411).json({
      message: "Invalid inputs!"
    })
    return;
  }

  const existingUser = await User.findOne({
    username
  });

  if(existingUser){
    res.status(411).json({
      message: "Email already taken/Incorrect input"
    })
    return;
  }

  const user = await User.create({
    username,
    password,
    firstName,
    lastName
  });

  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 100000
  })

  const userId = user._id;

  const token = jwt.sign({userId}, JWT_SECRET);
  
  res.json({
      message: "User created successfully",
      token: token
  })
  
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
 
  const { success } = validationSchemaSignin.safeParse({ username, password });

  if(!success){
   res.status(411).json({ 
    message: "Invalid inputs!"
    })
   return 
  }

  const user = await User.findOne({
    username,
    password
  });

  if(user){
    const userId = user._id;

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200)
      .json({
        token: token
    })
  } else {
    res.status(411).json("Error while logging in")
  }
})

router.put('/', authMiddleware, async (req, res) => {
  const { password, firstName, lastName } = req.body;
  const { userId } = req;

  const { success } = updateValidationSchema.safeParse({ password, firstName, lastName });

  if(!success){
   res.status(411).json({ 
    message: "Invalid inputs!"
    })
   return 
  };

  await User.updateOne({_id: userId} , { password, firstName, lastName });

  res.json({
    message: "Updated success fully"
  })
    
});


router.get('/bulk', authMiddleware, async (req, res) => {
  const { filter } = req.query;

  const users = await User.find({
    $or: [
      {
        firstName: {
          "$regex": filter
        }
      } , 
      {
         lastName: {
           "$regex": filter
        }
      }
    ]
   });
  
   res.status(200).json({
     user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))    
  })
});

module.exports = router
