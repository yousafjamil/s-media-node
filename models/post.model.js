const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        required: [true, 'please enter caption']         
    },
    img: {
        public_id: String,
        url: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            required: true
        },
    }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
   
},{timestamps:true})

const postmodel = mongoose.model('Post', postSchema);
module.exports = postmodel;