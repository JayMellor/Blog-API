# Blog API

A simple blog CRUD API for interfacing with a MongoDB database.

Uses the following schema:

````JavaScript
const blogModel = new Schema({
    title: { type: String },
    author: { type: String }, //todo
    date: { type: Date },
    summary: { type: String },
    content: { type: String }
});
````
Author will become _id relating to the user.
