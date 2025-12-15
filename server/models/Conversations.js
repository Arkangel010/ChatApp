const mongoose = require('mongoose'); 

const conversationSchema = mongoose.Schema({
    members: {
        type: Array, 
        required: true,
    }
});

const Users = mongoose.model('conversations', conversationSchema); 

module.exports = Users; 