const mongoose = require("mongoose");

// TbfvTnrFyqzTzRJd

mongoose.connect('mongodb://localhost:27017/paytem-clone')
  .then(() => console.log("connected db"))
  .catch(() => console.log("error connecting db"))

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 20
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  }
});

const AccountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true
  }
})

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountsSchema)


module.exports = {
  User,
  Account
}
