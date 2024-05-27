const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../user/user-model");
const { loginValidationSchema } = require('../user/userValidation');

module.exports=app=>{
    app.post('/users/login',async(req,res)=>{
        const{email,password}=req.body;

        const { error, value } = loginValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
          return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }

        try{
          const user=await User.findOne({email});

          if(!user){
              return res.status(401).send('Email or password is incorrect.');
          }
  
          const passwordMatch=await bcrypt.compare(password, user.password);

          if(!passwordMatch){
              return res.status(401).send('Email or password is incorrect.');
          }
          const currentUser = await User.findOne({ email }).select('-password -phone -createdTime -email -city -street -houseNumber');

          const token = jwt.sign({ 
              userId: user._id,  
              isAdmin: user.roleType, 
              currentUser,
            },
              process.env.JWT_SECRET, { expiresIn: '4h' });
  
              res.status(200).json({
                token,
                user:currentUser
              })
              
        }catch(error){
          res.status(500).send({ error: 'Error creating user' });
        }
        
    })
} 