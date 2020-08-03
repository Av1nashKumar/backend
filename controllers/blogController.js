const express = require('express');
const mongoose = require('mongoose');
//Importing the model here
const blogModel = mongoose.model('Blog');
const shortid = require('shortid');
const response = require('./../libs/response.libs');
const time = require('./../libs/time.libs');
const check = require('./../libs/check.libs');
const logger = require('./../libs/logger.libs');

let getAllBlog = (req, res) => {
        blogModel.find()
            .select('-__v -_id') //delect these two
            .lean() // to create a plain javascript object
            .exec((err, result) => { //execute function with callback
                if (err) {
                    logger.error(err.message, 'Blog Controller: getAllBlog', 10)
                    let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Blog Found', 'Blog Controller: getAllBlog', 5)
                    let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                    res.send(apiResponse)
                } else {
                    // logger.info('Blog Found', 'Blog Controller: getAllBlog', 5)
                    let apiResponse = response.generate(false, 'Blog Found', 200, result);
                    res.send(apiResponse)
                }
            })
    } // end get all blogs


//get Blog By id
let viewByBlogId = (req, res) => {


        blogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByBlogId', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: viewByBlogId', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Found', 200, result);
                res.send(apiResponse)
            }

        });


    } //blog by id end

//get blogs by author
let viewByAuthor = (req, res) => {

        blogModel.find({ 'author': req.params.author }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByAuthor', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: viewByAuthor', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Found', 200, result);
                res.send(apiResponse)
            }

        });

    } //blog by author end


//get Blog by category
let viewByCategory = (req, res) => {

        blogModel.find({ 'category': req.params.category }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByCategory', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: viewByCategory', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Found', 200, result);
                res.send(apiResponse)
            }

        });

    } //blog by category end

//delete blog by ID
let deleteBlog = (req, res) => {

        blogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {
            if (err) {
                logger.error(err.message, 'Blog Controller: deleteBlog', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: deleteBlog', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Found', 200, result);
                res.send(apiResponse)

            }
        })


    } //delete blog by id end

//edit blog by id
let editBlog = (req, res) => {

        blogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: editBlog', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: editBlog', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {
                let today = time.now();
                result.title = (!check.isEmpty(req.body.title)) ? req.body.title : result.title,
                    result.description = (!check.isEmpty(req.body.description)) ? req.body.description : result.description,
                    result.bodyHtml = (!check.isEmpty(req.body.blogBody)) ? req.body.blogBody : result.blogBody,
                    result.isPublished = (!check.isEmpty(req.body.isPublished)) ? req.body.isPublished : result.isPublished,
                    result.category = (!check.isEmpty(req.body.category)) ? req.body.category : result.category,
                    result.author = (!check.isEmpty(req.body.fullName)) ? req.body.fullName : result.fullName,
                    result.tags = (!check.isEmpty(req.body.tags)) ? (!check.isEmpty(req.body.tags)) ? check.trim(req.body.tags).split(',') : [] : result.tags,
                    result.lastModified = today


                result.save(function(err, result) {
                    if (err) {
                        let apiResponse = response.generate(true, 'Failed to edit the blog', 500, null);
                        res.send(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Blog Updated Successfully', 200, result);
                        res.send(apiResponse)

                    }
                }); // end result

            }
        })

    } //edit blog end


//create blog
let createBlog = (req, res) => {

        let today = time.now();
        let blogId = shortid.generate();

        let newBlog = new blogModel({

            blogId: blogId,
            lastModified: today,
            created: today,
            author: req.body.author,
            category: req.body.category,
            isPublished: req.body.isPublished,
            bodyHtml: req.body.bodyHtml,
            description: req.body.description,
            title: req.body.title

        });

        let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.replace(/\s/g, "").split(',') : []
        newBlog.tags = tags;

        newBlog.save((err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: createBlog', 10)
                let apiResponse = response.generate(true, 'Failed to create Blog', 500, null);
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: createBlog', 5)
                let apiResponse = response.generate(true, 'Failed to create Blog', 404, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Created Successfully', 200, result);
                res.send(apiResponse)
            }

        })

    } //create blog end


//Increase blog view
let increaseBlogView = (req, res) => {

        blogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: increaseBlogView', 10)
                let apiResponse = response.generate(true, 'Failed to find the blog', 500, null);
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller: increaseBlogView', 5)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null);
                res.send(apiResponse)
            } else {

                result.views += 1;
                result.save(function(err, result) {
                    if (err) {
                        let apiResponse = response.generate(true, 'Failed to Increase the view', 500, null);
                        res.send(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Blog Updated Successfully', 200, result);
                        res.send(apiResponse)

                    }
                }); // end result

            }
        })

    } //Increase blog view end



let testRoute = (req, res) => {
    //route or simple parameters are readed as params (GET)
    //@URL http://localhost:3000/test/route/a/b

    console.log(req.params);
    res.send(req.params);

};

let testQuery = (req, res) => {
    //query parameters are readed as query (GET)
    //@URL http://localhost:3000/test/query?firstName=Avinash&lastName=Kumar

    console.log(req.query);
    res.send(req.query);

};

let testBody = (req, res) => {
    //body parameter are readed as body (POST)
    //@URL http://localhost:3000/test/body
    console.log(req.body);
    res.send(req.body);

};

module.exports = {

    getAllBlog: getAllBlog,
    viewByBlogId: viewByBlogId,
    viewByAuthor: viewByAuthor,
    viewByCategory: viewByCategory,
    deleteBlog: deleteBlog,
    editBlog: editBlog,
    createBlog: createBlog,
    increaseBlogView: increaseBlogView,

    //for testing only
    testRoute: testRoute,
    testQuery: testQuery,
    testBody: testBody
        //for testing only

}