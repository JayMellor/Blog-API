
const Comment = require('../models/comment.model');
const Response = require('../models/response.model');
const httpStatus = require('http-status');
const UserService = require('../common/user.service');

const addComment = (request, response) => {

    if (!request.body.authorId || request.body.authorId === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Author ID required'));
    }
    if (!request.body.blogId || request.body.blogId === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Blog ID required'));
    }

    const comment = new Comment(request.body);

    return comment.save(error => {
        if (error) {
            return response.send(error);
        }

        return response.json(comment);
    });

};

const getComments = (request, response) => {

    Comment.find((error, comments) => {

        if (error) {
            return response.send(error);
        }

        return response.json(comments.map(comment => {
            const newComment = comment.toJSON();
            newComment.links = {};
            newComment.links.self = `http://${request.headers.host}/api/comments/${newComment._id}`;
            return newComment;
        }));

    })

};

const getCommentsForBlog = (request, response) => {

    Comment.find({ blogId: request.params.blogId }, (error, comments) => {

        if (error) {
            return response.send(error);
        }

        const userPromises = comments.map(async comment => {
            const userPromise = await UserService.getUser(comment.authorId);
            return userPromise;
        });

        const suppressRejection = (promise) => {
            if (promise.catch) {
                return promise.catch(error => null);
            }
            return promise;
        };

        Promise.all(userPromises.map(suppressRejection))
            .then(promises => {
                comments = promises.map((promise, index) => {

                    if (!promise) {
                        return comments[index];
                    }

                    const newComment = comments[index].toJSON();
                    newComment.author = JSON.parse(promise);

                    // newBlog.links = {};
                    // newBlog.links.self = `http://${request.headers.host}/api/blogs/${newBlog._id}`;

                    return newComment;
                });

                return response.send(comments);
            });

    })
};

const deleteCommentsForBlog = (request, response) => {

    Comment.deleteMany({ blogId: request.params.blogId }, error => {
        if (error) {
            return response.error(error);
        }

        return response.sendStatus(httpStatus.NO_CONTENT);
    })

}

const findCommentById = (request, response, next) => {
    Comment.findById(request.params.commentId, (error, comment) => {
        if (error) {
            return response.send(error);
        }
        if (comment) {
            request.comment = comment;
            return next();
        }
        else {
            return response.sendStatus(httpStatus.NOT_FOUND);
        }
    });
}

const deleteComment = (request, response) => {
    request.comment.remove(error => {
        if (error) {
            return response.error(error);
        }

        return response.sendStatus(httpStatus.NO_CONTENT);
    });
};

module.exports = { addComment, getComments, getCommentsForBlog, deleteCommentsForBlog, findCommentById, deleteComment };