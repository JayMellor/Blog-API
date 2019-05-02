
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogModel = new Schema({
    title: { type: String, required: true },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: Date, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Blog', blogModel);