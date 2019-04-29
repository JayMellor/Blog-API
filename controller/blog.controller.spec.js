
const sinon = require('sinon');
const should = require('should');
const httpStatus = require('http-status');
const blogController = require('../controller/blog.controller');

describe('Blog Controller Tests', () => {

    describe('addBlog', () => {

        it('should not allow an empty title', () => {

            class Response {
                constructor(success, message) {
                    this.success = success;
                    this.message = message;
                }
            }

            const request = {
                body: {
                    author: 'test author',
                    date: 'test date',
                    summary: 'test summary',
                    content: 'test content'
                }
            };

            const response = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            };

            const controller = blogController;

            controller.addBlog(request, response);

            response.status.calledWith(httpStatus.BAD_REQUEST)
                .should.equal(true, `Invalid status: ${response.status.args[0][0]} (${httpStatus[response.status.args[0][0]]})`);

            response.send.calledWith(new Response(false, 'Title required'))
                .should.equal(true, `Invalid response: \n${JSON.stringify(response.send.args[0][0])}`);

        });

        it('should not allow an empty author', () => {

            class Response {
                constructor(success, message) {
                    this.success = success;
                    this.message = message;
                }
            }

            const request = {
                body: {
                    title: 'test title',
                    date: 'test date',
                    summary: 'test summary',
                    content: 'test content'

                }
            };

            const response = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            };

            const controller = blogController;

            controller.addBlog(request, response);

            response.status.calledWith(httpStatus.BAD_REQUEST)
                .should.equal(true, `Invalid status: ${response.status.args[0][0]} (${httpStatus[response.status.args[0][0]]})`);

            response.send.calledWith(new Response(false, 'Author required'))
                .should.equal(true, `Invalid response: \n${JSON.stringify(response.send.args[0][0])}`);

        });

        it('should not allow an empty summary', () => {

            class Response {
                constructor(success, message) {
                    this.success = success;
                    this.message = message;
                }
            }

            const request = {
                body: {
                    title: 'test title',
                    author: 'test author',
                    date: 'test date',
                    content: 'test content'

                }
            };

            const response = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            };

            const controller = blogController;

            controller.addBlog(request, response);

            response.status.calledWith(httpStatus.BAD_REQUEST)
                .should.equal(true, `Invalid status: ${response.status.args[0][0]} (${httpStatus[response.status.args[0][0]]})`);

            response.send.calledWith(new Response(false, 'Summary required'))
                .should.equal(true, `Invalid response: \n${JSON.stringify(response.send.args[0][0], null, 1)}`);

        });

        it('should not allow an empty content', () => {

            class Response {
                constructor(success, message) {
                    this.success = success;
                    this.message = message;
                }
            }

            const request = {
                body: {
                    title: 'test title',
                    author: 'test author',
                    date: 'test date',
                    summary: 'test summary'
                }
            };

            const response = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            };

            const controller = blogController;

            controller.addBlog(request, response);

            response.status.calledWith(httpStatus.BAD_REQUEST)
                .should.equal(true, `Invalid status: ${response.status.args[0][0]} (${httpStatus[response.status.args[0][0]]})`);

            response.send.calledWith(new Response(false, 'Content required'))
                .should.equal(true, `Invalid response: \n${JSON.stringify(response.send.args[0][0], null, 1)}`);

        });

    });

});