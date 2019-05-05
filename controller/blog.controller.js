"use-strict";

const Blog = require('../models/blog.model');
const Response = require('../models/response.model');
const httpStatus = require('http-status');
const UserService = require('../common/user.service');
const CommentService = require('../common/comment.service');

const addBlog = (request, response) => {

    if (!request.body.title || request.body.title === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Title required'));
    }
    if (!request.body.authorId || request.body.authorId === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Author ID required'));
    }
    if (!request.body.date) {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Date required'));
    }
    if (!request.body.summary || request.body.summary === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Summary required'));
    }
    if (!request.body.content || request.body.content === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Content required'));
    }

    const blog = new Blog(request.body);

    return blog.save((error) => {
        if (error) {
            return response.send(error);
        }
        response.status(httpStatus.CREATED);
        return response.json(blog);
    });

};

/**
 * Finds all blogs, returning all fields but the content field
 * @param {Object} request 
 * @param {Object} response 
 */
const getBlogs = (request, response) => {

    Blog.find({}, '-content', (error, blogs) => {

        if (error) {
            return response.send(error);
        }

        const userPromises = blogs.map(async blog => {

            const promiseResponse = await UserService.getUser(blog.authorId);

            return promiseResponse;

        });

        const suppressRejection = (promise) => {
            if (promise.catch) {
                return promise.catch(error => null);
            }
            return promise;
        }

        Promise.all(userPromises.map(suppressRejection))
            .then(promises => {
                blogs = promises.map((promise, index) => {

                    if (!promise) {
                        return blogs[index];
                    }

                    const newBlog = blogs[index].toJSON();
                    newBlog.author = JSON.parse(promise);

                    newBlog.links = {};
                    newBlog.links.self = `http://${request.headers.host}/api/blogs/${newBlog._id}`;

                    return newBlog;
                });

                return response.json(blogs);
            })
            .catch(error => {
                console.error(error);
                return response.send('error handling request');
            });

    });
};

/**
 * Middleware function that searches for a blog entry
 * @param {Object} request request object containing blog ID 
 * @param {Object} response response object
 * @param {function} next next function that proceeds flow to
 * next function in the list
 */
const findBlogById = (request, response, next) => {
    Blog.findById(request.params.blogId, (error, blog) => {
        if (error) {
            return response.send(error);
        }
        if (blog) {
            request.blog = blog;
            return next();
        }
        else {
            return response.sendStatus(httpStatus.NOT_FOUND);
        }
    });

};

const getBlog = (request, response) => {

    const blog = request.blog;
    const modifiedBlog = blog.toJSON();

    userPromise = UserService.getUser(blog.authorId);

    userPromise.then(user => {
        modifiedBlog.author = JSON.parse(user);
    })
        .catch(error => {
            console.error(error.body);
        });

    commentPromise = CommentService.getCommentsForBlog(blog._id);
    commentPromise.then(comments => {
        modifiedBlog.comments = JSON.parse(comments);
    })
        .catch(error => {
            console.error(error.body);
        })

    Promise.all([userPromise, commentPromise]).then( () => {
        return response.json(modifiedBlog);
    }) // todo catch?

};

const updateBlog = (request, response) => {

    const { blog } = request;
    blog.title = request.body.title;
    blog.authorId = request.body.authorId;
    blog.date = request.body.date;
    blog.summary = request.body.summary;
    blog.content = request.body.content;

    return request.blog.save((error) => {
        if (error) {
            return response.send(error);
        }
        return response.json(blog);
    });

};

const deleteBlog = (request, response) => {

    const { blog } = request;

    const commentPromise = CommentService.deleteCommentsForBlog(blog._id);
    const blogPromise = blog.remove();

    Promise.all([commentPromise,blogPromise])
    .then( () => response.sendStatus(httpStatus.NO_CONTENT))
    .catch( error => response.send(error));
};

module.exports = { addBlog, getBlogs, findBlogById, getBlog, updateBlog, deleteBlog };