"use-strict";

const Blog = require('../models/blog.model');
const Response = require('../models/response.model');
const httpStatus = require('http-status');

const addBlog = (request, response) => {

    if (!request.body.title || request.body.title === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Title required'));
    }
    if (!request.body.author || request.body.author === '') {
        response.status(httpStatus.BAD_REQUEST);
        return response.send(new Response(false, 'Author required'));
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

        const blogsWithLinks = blogs.map(blog => {
            const newBlog = blog.toJSON();
            newBlog.links = {};
            newBlog.links.self = `http://${request.headers.host}/api/blogs/${blog._id}`;
            return newBlog;
        });

        return response.json(blogsWithLinks);
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
    return response.status(httpStatus.OK).json(request.blog);

};

const updateblog = (request, response) => {

    const { blog } = request;
    blog.partNumber = request.body.partNumber;
    blog.description = request.body.description;
    blog.price = request.body.price;

    return request.blog.save((error) => {
        if (error) {
            return response.send(error);
        }
        return response.json(blog);
    });

};

const deleteblog = (request, response) => {
    request.blog.remove((error) => {
        if (error) {
            return response.send(error);
        }
        return response.sendStatus(httpStatus.NO_CONTENT);
    })
};

module.exports = { addBlog, getBlogs, findBlogById, getBlog, updateBlog, deleteBlog };