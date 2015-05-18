'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Test = mongoose.model('Test'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a idea
 */
exports.check = function(req, res) {
var user = new User(req.body);
Test.find({'username': user.username, 'employeeId':user.employeeId}).exec(function(err, ideas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(ideas);
		}
});
	
};

