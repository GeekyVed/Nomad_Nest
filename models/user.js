const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    // Hashed and salted username and pass by default
});

userSchema.plugin(passportLocalMongoose); // auto username & pass here!

module.exports = mongoose.model('User', userSchema);