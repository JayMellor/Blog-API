
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentModel = new Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    date: { type: Date, required: true },
    body: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentModel);