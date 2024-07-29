const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
   
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
