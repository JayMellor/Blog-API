
const request = require('request-promise-native');
const USER_API_PATH = require('./api-paths.conf').USER_API_PATH;

const options = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
};

const getUser = (userId) => request.get(`${USER_API_PATH}/api/users/${userId}`, options);

module.exports = { getUser };