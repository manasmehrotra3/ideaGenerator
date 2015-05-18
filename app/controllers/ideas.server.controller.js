'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Idea = mongoose.model('Idea'),
	_ = require('lodash');

/**
 * Create a idea
 */
exports.create = function(req, res) {
	var idea = new Idea(JSON.parse(req.body.idea));
	idea.user = req.user;
	if(req.files.file) {
		idea.attachment = req.files.file.path.substring(7);
		idea.originalName = req.files.file.originalname;
	}

	idea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(idea);
		}
	});
};

exports.createIE = function(req, res) {
	var idea = new Idea(req.body);
	idea.user = req.user;
	if(req.files.file) {
		idea.attachment = req.files.file.path.substring(7);
		idea.originalName = req.files.file.originalname;
	}

	idea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(idea);
		}
	});
};

exports.pendingcreate = function(req, res) {
	var idea = new Idea(req.body);
	idea.user = req.user;
	idea.status = 'Approved';

	idea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(idea);
		}
	});
};

/**
 * Show the current idea
 */
exports.read = function(req, res) {
	res.json(req.idea);
};

/**
 * Update a idea
 */
exports.update = function(req, res) {
	var idea = req.idea;

	idea = _.extend(idea, req.body);

	idea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(idea);
		}
	});
};

/**
 * Delete an idea
 */
exports.delete = function(req, res) {
	var idea = req.idea;

	idea.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(idea);
		}
	});
};

exports.readmyideas = function(req, res) {
	Idea.find({'user': req.user.id}).sort('-created').populate('user', 'displayName').exec(function(err, ideas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(ideas);
		}
	});
};

/**
 * List of Ideas
 */
exports.list = function(req, res) {
	Idea.find({'status': 'Approved'}).sort('-created').populate('user', 'displayName').exec(function(err, ideas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(ideas);
		}
	});
};

exports.pendinglist = function(req, res) {
	Idea.find({'status': 'Pending Admin Approval'}).sort('-created').populate('user', 'displayName').exec(function(err, ideas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(ideas);
		}
	});
};

/**
 * Idea middleware
 */
exports.ideaByID = function(req, res, next, id) {
	Idea.findById(id).populate('user', 'displayName').exec(function(err, idea) {
		if (err) return next(err);
		if (!idea) return next(new Error('Failed to load idea ' + id));
		req.idea = idea;
		next();
	});
};

/**
 * Idea authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.idea.user.id !== req.user.id && req.user.roles.indexOf('admin')===-1) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};