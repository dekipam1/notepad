const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const UserSchema = new Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String},
  password: String, 
  googleId: { type: String },
  date: { type: Date, default: Date.now }
});


  // username: { 
  //   type: String, 
  //   required: true,
  // },
  // email: {
  //   type: String,
  //   required: true, 
  // },
  // password: {
  //   type: String,
  //   required: true, 
  // }
  // googleId: {
  //   type: String,
  //   required: true
  // }
  // displayName: {
  //   type: String,
  //   required: true
  // },
  // firstName: {
  //   type: String,
  //   required: true,
  // }
  // lastName: {
  //   type: String,
  //   required: true
  // },
  // profileImage: {
  //   type: String,
  //   required: true
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // }
// });

// Hash password before saving
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt();
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });
// Compare entered password with the hashed password in the database
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('User', UserSchema);