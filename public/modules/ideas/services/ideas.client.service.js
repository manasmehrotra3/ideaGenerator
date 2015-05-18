'use strict';

//Ideas service used for communicating with the ideas REST endpoints
angular.module('ideas').factory('Ideas', ['$resource',
	function($resource) {
		return $resource('ideas/:ideaId', {
			ideaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('ideas').factory('IdeasService', ['$http','$rootScope', '$location', function($http, $rootScope, $location) 
{
    var service={};

    service.saveItem = function(idea, image)
    {
        var fd = new FormData();
        fd.append('file', image);
        fd.append('idea', JSON.stringify(idea));
        $http.post('ideas', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            $location.path('minions');
        })
        .error(function(e){
            console.log('error add new item', e);
        });
    };

    return service;
}

]);

angular.module('ideas').factory('IdeasIE', ['$resource',
	function($resource) {
		return $resource('ideasIE', {
			ideaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('ideas').factory('Pending', ['$resource',
	function($resource) {
		return $resource('pending', {
			ideaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('ideas').factory('MyIdeas', ['$resource',
	function($resource) {
		return $resource('myideas', {
			ideaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);