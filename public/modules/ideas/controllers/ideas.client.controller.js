'use strict';

angular.module('ideas').controller('IdeasController', ['$scope', '$timeout', 'Upload', '$stateParams', '$location', 'Authentication', 'Ideas', 'Pending', 'MyIdeas', 'IdeasService', 'IdeasIE', 
	function($scope, $timeout, Upload, $stateParams, $location, Authentication, Ideas, Pending, MyIdeas, IdeasService, IdeasIE) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var idea = new Ideas({
				title: this.title,
				content: this.content
			});
			IdeasService.saveItem(idea,$scope.myFile);
		};

		$scope.createIE = function() {
			var idea = new IdeasIE({
				title: this.title,
				content: this.content,
			});
			if($scope.files && $scope.files.length) {
				var file = $scope.files[0];
				Upload.upload({
	                    url: 'ideasIE',
	                    fields: idea,
	                    file: file
	            }).success(function (data, status, headers, config) {
                    $location.path('minions');
                });
			}
			else {
				IdeasService.saveItem(idea, '');
			}
		};

		$scope.remove = function(idea) {
			if (idea) {
				idea.$remove();

				for (var i in $scope.ideas) {
					if ($scope.ideas[i] === idea) {
						$scope.ideas.splice(i, 1);
					}
				}
			} else {
				$scope.idea.$remove(function() {
					$location.path('ideas');
				});
			}
		};

		$scope.removeVolunteer = function(volunteer, index) {
			volunteer.splice(index, 1);
			var idea = $scope.idea;
			idea.volunteer = volunteer;
			idea.$update(function() {
				$location.path('ideas/' + idea._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removepending = function() {
			var idea = $scope.idea;
			idea.status = 'Rejected by Admin';

			idea.$update(function() {
				$location.path('pending');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removeAttachment = function() {
			var idea = $scope.idea;
			idea.attachment = '';
			idea.originalName = '';
			idea.$update();
		};

		$scope.volunteer = function() {
			var volunteer = $scope.authentication.user.displayName;
			var idea = $scope.idea;
			idea.volunteer.push(volunteer);
			idea.$update(function() {
				$location.path('ideas/' + idea._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.update = function() {
			var idea = $scope.idea;

			idea.$update(function() {
				// $scope.$broadcast('changeToken');
				$location.path('ideas/' + idea._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.$on('changeToken', function(e) {
	        $timeout(function() {
	            $scope.ideas = Ideas.query();
	        });
	    });

		$scope.approve = function() {
			var idea = $scope.idea;
			idea.status = 'Approved';

			idea.$update(function() {
				$location.path('pending');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.ideas = Ideas.query();
		};

		$scope.findMyIdea = function() {
			$scope.ideas = MyIdeas.query();	
		};

		$scope.findPending = function() {
			$scope.ideas = Pending.query();
		};		

		$scope.findOne = function() {
			$scope.idea = Ideas.get({
				ideaId: $stateParams.ideaId
			});
		};
	}
]);