
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogModel = new Schema({
    title: { type: String },
    author: { type: String }, //todo
    date: { type: Date },
    summary: { type: String },
    content: { type: String }
});

module.exports = mongoose.model('Blog', blogModel);