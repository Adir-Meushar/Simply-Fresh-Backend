const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');

const RoleType={
    user:10,
    admin:20,
}

const userSchema=new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email:{type:String,required:true,unique:true},
    password: {type: String, required: true },
    city: { type: String, required: true }, 
    street: { type: String, required: true },
    houseNumber: { type: Number, required: true }, 
    roleType:{type:Number,default:RoleType.user},
    createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
}); 

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
      return next();
  }

  try {
      user.password = await bcrypt.hash(this.password, 10);
      next();
  } catch (err) {
      return next(err);
  }
});

const User = mongoose.model('users', userSchema);

module.exports = { User, RoleType };