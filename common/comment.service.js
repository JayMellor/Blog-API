const request = require('request-promise-native');
const COMMENT_API_PATH = require('./api-paths.conf').COMMENT_API_PATH;

const options = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
};

const getCommentsForBlog = (blogId) => request.get(`${COMMENT_API_PATH}/api/comments/byblog/${blogId}`, options);
const deleteCommentsForBlog = (blogId) => request.delete(`${COMMENT_API_PATH}/api/comments/byblog/${blogId}`, options);

module.exports = { getCommentsForBlog, deleteCommentsForBlog };