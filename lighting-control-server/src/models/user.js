const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const dbUrl = 'mongodb://localhost/lighting';

mongoose.connect(dbUrl, { useNewUrlParser: true });

let userSchema = mongoose.Schema({
  username: {
    unique: true,
    type: String
  },
  password: String,
  role: {
    type: Number,
    default: 50
  }
});

userSchema.pre('save',function(next){
  let user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err){
      return next(err)
    }
    bcrypt.hash(user.password,salt,function(err,hash){
      if(err){
        return next(err)
      }
      user.password = hash;
      next();
    })
  })
});

userSchema.methods={
  comparePassword: function(_password,cb){
    bcrypt.compare(_password,this.password,function(err,isMatch){
      if(err){
        return cb(err);
      }else{
        cb(null,isMatch);
      }
    })
  }
};

let userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;