var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var UserSchema = Schema({
    name: String,
    firstname: String,
    lastname: String,
    email: String,
    key:String,
    password:String,
    phone:String,
    username: String,
    facebook_id: String,
    facebook: {}
});

mongoose.model('UserModel', UserSchema);