const guard=require('../helpers/guard');
const { getUserInfo } = require('../helpers/jwtUtils');
const { User, RoleType } = require('./user-model');
const { updateUserValidationSchema } = require('./userValidation');

module.exports=app=>{

    //Get All Users||Permissions:Admin//
    app.get('/users',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);

        if(userToken.isAdmin!=RoleType.admin){
            return res.status(401).send({
                error: {
                  code: 401,
                  message: 'Unauthorized',
                  details: 'User authentication failed.',
                },
              });
        }
        try{

            const users=await User.find();
            
            res.send(users);

        }catch(error){
            res.status(500).send('Internal Server Error');
        }
    });

    //Get Current User||Permissions:Admin,Current user//
    app.get('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);

        if(userToken.userId!==req.params.id&&userToken.isAdmin!=RoleType.admin){
            return res.status(401).send({
                error: {
                  code: 401,
                  message: 'Unauthorized',
                  details: 'User authentication failed.',
                },
              });
        }

        try{

            const currentUser=await User.findById(req.params.id).select('-password');

            if(!currentUser){
                return res.status(404).send('User not found');
            }

            res.send(currentUser);

        }catch(error){
             res.status(500).send('Internal Server Error');
        }
    });

    //Edit User||Permissions:Current user//
    app.put('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);

        if(userToken.userId!==req.params.id){
            return res.status(401).send({
                error: {
                  code: 401,
                  message: 'Unauthorized',
                  details: 'User authentication failed.',
                },
              });
        }

        try{

            const {error,value}=updateUserValidationSchema.validate(req.body,{abortEarly:false});

            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
              }

           const existingUser = await User.findOne({ email: value.email, _id: { $ne: req.params.id } });

           if (existingUser) {
            return res.status(400).send({
              error: {
                  code: 400,
                  message: 'Alredy exist',
                  details: 'User with the same Email Alredy exist.',
              },
          });
             }

             const user=await User.findById(req.params.id);

             if (!user) {
                return res.status(404).send('User not found.');
              }
       
               user.set(value);
    
               const newUser = await user.save();
     
               res.status(200).send(newUser);
        }catch (error) {
            res.status(500).send('Internal Server Error');
          }
    })

    //Delete User||Permissions:Admin,Current user//
    app.delete('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);

        if(userToken.userId!==req.params.id&&userToken.isAdmin!=RoleType.admin){
            return res.status(401).send({
                error: {
                  code: 401,
                  message: 'Unauthorized',
                  details: 'User authentication failed.',
                },
              });
        }

        try{
          
          const currentUser=await User.findByIdAndDelete(req.params.id);

          if(!currentUser){
            return res.status(403).send('User not found');
          }

          res.status(200).send({
            message:`User was deleted sucssesfully!`,
            deletedUser:currentUser,
          });
        }catch(error){
             res.status(500).send('Internal Server Error');
        }
    })

    //Change User Role||Permissions:Admin//
    app.patch('/users/:id',guard,async(req,res)=>{
      const userToken=getUserInfo(req,res);

      if(userToken.isAdmin!=RoleType.admin){
          return res.status(401).send({
              error: {
                code: 401,
                message: 'Unauthorized',
                details: 'User authentication failed.',
              },
            });
      }
      try{

        const user=await User.findByIdAndUpdate(req.params.id);

        if(!user){
          return res.status(403).send('User not found');
        }
        
        user.roleType = user.roleType !== RoleType.admin ? RoleType.admin : RoleType.user;

       await user.save();

        res.status(200).send({
          message:`User was updated sucssesfully!`,
          updated:user,
        });
      }catch(error){
           res.status(500).send('Internal Server Error');
      }
  })
};