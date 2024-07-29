const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment.replies',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
