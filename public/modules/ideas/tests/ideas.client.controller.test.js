'use strict';

(function() {
	// Ideas Controller Spec
	describe('IdeasController', function() {
		// Initialize global variables
		var IdeasController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Ideas controller.
			IdeasController = $controller('IdeasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one idea object fetched from XHR', inject(function(Ideas) {
			// Create sample idea using the Ideas service
			var sampleIdea = new Ideas({
				title: 'An Idea about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample ideas array that includes the new idea
			var sampleIdeas = [sampleIdea];

			// Set GET response
			$httpBackend.expectGET('ideas').respond(sampleIdeas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ideas).toEqualData(sampleIdeas);
		}));

		it('$scope.findOne() should create an array with one idea object fetched from XHR using a ideaId URL parameter', inject(function(Ideas) {
			// Define a sample idea object
			var sampleIdea = new Ideas({
				title: 'An Idea about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.ideaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ideas\/([0-9a-fA-F]{24})$/).respond(sampleIdea);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.idea).toEqualData(sampleIdea);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ideas) {
			// Create a sample idea object
			var sampleIdeaPostData = new Ideas({
				title: 'An Idea about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample idea response
			var sampleIdeaResponse = new Ideas({
				_id: '525cf20451979dea2c000001',
				title: 'An Idea about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Idea about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('ideas', sampleIdeaPostData).respond(sampleIdeaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the idea was created
			expect($location.path()).toBe('/ideas/' + sampleIdeaResponse._id);
		}));

		it('$scope.update() should update a valid idea', inject(function(Ideas) {
			// Define a sample idea put data
			var sampleIdeaPutData = new Ideas({
				_id: '525cf20451979dea2c000001',
				title: 'An Idea about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock idea in scope
			scope.idea = sampleIdeaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ideas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ideas/' + sampleIdeaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ideaId and remove the idea from the scope', inject(function(Ideas) {
			// Create new idea object
			var sampleIdea = new Ideas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new ideas array and include the idea
			scope.ideas = [sampleIdea];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ideas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIdea);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ideas.length).toBe(0);
		}));
	});
}());