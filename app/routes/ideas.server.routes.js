'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	ideas = require('../../app/controllers/ideas.server.controller');
var multer = require('multer');

module.exports = function(app) {
	app.use(multer({ dest:'./public/uploads'}));
	// Idea Routes
	app.route('/ideas')
		.get(users.requiresLogin, ideas.list)
		.post(users.requiresLogin, ideas.create);

	app.route('/ideasIE')
		.post(users.requiresLogin, ideas.createIE);

	app.route('/pending')
		.get(users.requiresLogin, ideas.pendinglist)
		.post(users.requiresLogin, ideas.pendingcreate);

	app.route('/myideas')
		.get(users.requiresLogin, ideas.readmyideas);

	app.route('/ideas/:ideaId')
		.get(users.requiresLogin, ideas.read)
		.put(users.requiresLogin, ideas.update)
		.delete(users.requiresLogin, ideas.hasAuthorization, ideas.delete);
		
	// Finish by binding the idea middleware
	app.param('ideaId', ideas.ideaByID);
};