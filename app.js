'use-strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogRouter = require('./router/blog.router')();

const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost/BlogAPI');

app.get('/', (request, response) => {
    response.send('Welcome to the Blog Nodemon API');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', blogRouter)

app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});