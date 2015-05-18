'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Idea = mongoose.model('Idea'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, idea;

/**
 * Idea routes tests
 */
describe('Idea CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new idea
		user.save(function() {
			idea = {
				title: 'Idea Title',
				content: 'Idea Content'
			};

			done();
		});
	});

	it('should be able to save an idea if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new idea
				agent.post('/ideas')
					.send(idea)
					.expect(200)
					.end(function(ideaSaveErr, ideaSaveRes) {
						// Handle idea save error
						if (ideaSaveErr) done(ideaSaveErr);

						// Get a list of ideas
						agent.get('/ideas')
							.end(function(ideasGetErr, ideasGetRes) {
								// Handle idea save error
								if (ideasGetErr) done(ideasGetErr);

								// Get ideas list
								var ideas = ideasGetRes.body;

								// Set assertions
								(ideas[0].user._id).should.equal(userId);
								(ideas[0].title).should.match('Idea Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an idea if not logged in', function(done) {
		agent.post('/ideas')
			.send(idea)
			.expect(401)
			.end(function(ideaSaveErr, ideaSaveRes) {
				// Call the assertion callback
				done(ideaSaveErr);
			});
	});

	it('should not be able to save an idea if no title is provided', function(done) {
		// Invalidate title field
		idea.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new idea
				agent.post('/ideas')
					.send(idea)
					.expect(400)
					.end(function(ideaSaveErr, ideaSaveRes) {
						// Set message assertion
						(ideaSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle idea save error
						done(ideaSaveErr);
					});
			});
	});

	it('should be able to update an idea if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new idea
				agent.post('/ideas')
					.send(idea)
					.expect(200)
					.end(function(ideaSaveErr, ideaSaveRes) {
						// Handle idea save error
						if (ideaSaveErr) done(ideaSaveErr);

						// Update idea title
						idea.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing idea
						agent.put('/ideas/' + ideaSaveRes.body._id)
							.send(idea)
							.expect(200)
							.end(function(ideaUpdateErr, ideaUpdateRes) {
								// Handle idea update error
								if (ideaUpdateErr) done(ideaUpdateErr);

								// Set assertions
								(ideaUpdateRes.body._id).should.equal(ideaSaveRes.body._id);
								(ideaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of ideas if not signed in', function(done) {
		// Create new idea model instance
		var ideaObj = new Idea(idea);

		// Save the idea
		ideaObj.save(function() {
			// Request ideas
			request(app).get('/ideas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single idea if not signed in', function(done) {
		// Create new idea model instance
		var ideaObj = new Idea(idea);

		// Save the idea
		ideaObj.save(function() {
			request(app).get('/ideas/' + ideaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', idea.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an idea if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new idea
				agent.post('/ideas')
					.send(idea)
					.expect(200)
					.end(function(ideaSaveErr, ideaSaveRes) {
						// Handle idea save error
						if (ideaSaveErr) done(ideaSaveErr);

						// Delete an existing idea
						agent.delete('/ideas/' + ideaSaveRes.body._id)
							.send(idea)
							.expect(200)
							.end(function(ideaDeleteErr, ideaDeleteRes) {
								// Handle idea error error
								if (ideaDeleteErr) done(ideaDeleteErr);

								// Set assertions
								(ideaDeleteRes.body._id).should.equal(ideaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an idea if not signed in', function(done) {
		// Set idea user 
		idea.user = user;

		// Create new idea model instance
		var ideaObj = new Idea(idea);

		// Save the idea
		ideaObj.save(function() {
			// Try deleting idea
			request(app).delete('/ideas/' + ideaObj._id)
			.expect(401)
			.end(function(ideaDeleteErr, ideaDeleteRes) {
				// Set message assertion
				(ideaDeleteRes.body.message).should.match('User is not logged in');

				// Handle idea error error
				done(ideaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Idea.remove().exec();
		done();
	});
});