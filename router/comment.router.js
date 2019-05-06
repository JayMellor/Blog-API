const express = require('express');
const cors = require('cors');

const controller = require('../controller/comment.controller');
const permittedOrigin = require('../common/permitted-origin');

module.exports = () => {

    const commentRouter = express.Router();

    const options = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: permittedOrigin,
        preflightContinue: false
    };

    //use cors middleware
    commentRouter.use(cors(options));

    commentRouter.route('/')
        .post(controller.addComment)
        .get(controller.getComments);

    commentRouter.route('/byblog/:blogId')
        .get(controller.getCommentsForBlog)
        .delete(controller.deleteCommentsForBlog);

    commentRouter.use('/:commentId', controller.findCommentById);

    commentRouter.route('/:commentId')
        // .get(controller.getBlog)
        .put(controller.updateComment)
        .delete(controller.deleteComment);

    commentRouter.options("*", cors(options));

    return commentRouter;

};