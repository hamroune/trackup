var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var UserDataSchema = Schema({
    userId: String,
    created_at: Date
}, { strict: false });

mongoose.model('UserDataModel', UserDataSchema);