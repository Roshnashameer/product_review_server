const Comment = require('../models/comment');
const User = require('../models/userModel');


exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.payload; // assuming req.payload contains the userId

    try {
        // Fetch the user information
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newComment = new Comment({
            productId,
            content,
            userId: user._id,
            userName: user.userName,
            replies: []
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addReply = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.payload; // assuming req.payload contains the userId

    try {
        // Fetch the user information
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.replies.push({
            content,
            userId: user._id,
            userName: user.userName
        });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReply = async (req, res) => {
    const { commentId, replyId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) return res.status(404).json({ message: 'Reply not found' });

        // Remove the reply from the array
        comment.replies.splice(replyIndex, 1);

        // Update the document in the database
        await Comment.findByIdAndUpdate(commentId, { replies: comment.replies }, { new: true, runValidators: true });

        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
