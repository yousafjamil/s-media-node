const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name']
    },
    email: {
        type: String,
        required: [true, 'please enter your email']
    },
    password: {
        type: String,
        required: [true, 'please enter your password']
    },
    avatar: {
        public_id: String,
        url: String
    },
    posts:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

})




module.exports=mongoose.model('User',userSchema)