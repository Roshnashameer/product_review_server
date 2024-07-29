const Comment = require('../models/comment');
const Like=require('../models/like')

exports.likeTarget = async (req, res) => {
    const { targetId, targetModel } = req.body;
    const userId = req.payload; 

    try {
        let target;
        if (targetModel === 'Comment') {
            target = await Comment.findById(targetId);
        } else if (targetModel === 'Reply') {
            target = await Comment.findOne({ 'replies._id': targetId }, { 'replies.$': 1 });
            target = target.replies[0];
        }

        if (!target) {
            return res.status(404).json({ message: `${targetModel} not found` });
        }

        const alreadyLiked = target.likedBy.includes(userId);
        if (alreadyLiked) {
            return res.status(400).json({ message: 'Already liked' });
        }

        await new Like({ [targetModel.toLowerCase() + 'Id']: targetId, userId }).save();
        target.likes += 1;
        target.likedBy.push(userId);

        if (targetModel === 'Comment') {
            await target.save();
        } else {
            await Comment.updateOne(
                { 'replies._id': targetId },
                { $set: { 'replies.$': target } }
            );
        }

        res.json({ likes: target.likes, likedBy: target.likedBy });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.unlikeTarget = async (req, res) => {
    const { targetId, targetModel } = req.body;
    const userId = req.payload; 
    try {
        let target;
        if (targetModel === 'Comment') {
            target = await Comment.findById(targetId);
        } else if (targetModel === 'Reply') {
            target = await Comment.findOne({ 'replies._id': targetId }, { 'replies.$': 1 });
            target = target.replies[0];
        }

        if (!target) {
            return res.status(404).json({ message: `${targetModel} not found` });
        }

        const alreadyLiked = target.likedBy.includes(userId);
        if (!alreadyLiked) {
            return res.status(400).json({ message: 'Not liked yet' });
        }

        await Like.findOneAndDelete({ [targetModel.toLowerCase() + 'Id']: targetId, userId });
        target.likes -= 1;
        target.likedBy = target.likedBy.filter(id => id.toString() !== userId);

        if (targetModel === 'Comment') {
            await target.save();
        } else {
            await Comment.updateOne(
                { 'replies._id': targetId },
                { $set: { 'replies.$': target } }
            );
        }

        res.json({ likes: target.likes, likedBy: target.likedBy });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};