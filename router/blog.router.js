const express = require('express');
const cors = require('cors');

const controller = require('../controller/blog.controller');
const permittedOrigin = require('../common/permitted-origin');

module.exports = () => {

    const blogRouter = express.Router();

    const options = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: permittedOrigin,
        preflightContinue: false
    };

    //use cors middleware
    blogRouter.use(cors(options));

    blogRouter.route('/blogs')
        .post(controller.addBlog)
        .get(controller.getBlogs);

    blogRouter.use('/blogs/:blogId', controller.findBlogById);

    blogRouter.route('/blogs/:blogId')
        .get(controller.getBlog)
        .put(controller.updateBlog)
        .delete(controller.deleteBlog);

    blogRouter.options("*", cors(options));

    return blogRouter;

};