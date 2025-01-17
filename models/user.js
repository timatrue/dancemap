const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
    required: true,
    min: 6,
    max: 50
	},
	email: {
		type: String,
    required: true,
    min: 6,
    max: 50
	},
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024   
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('user', UserSchema);


module.exports = User;