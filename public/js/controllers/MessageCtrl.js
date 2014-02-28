var MessageCtrl = function($scope, $http, $routeParams, $location, $window) {
  $scope.user = [];
  $scope.requests = [];
  $scope.offers = [];
  // Currently (02/26/2014), a bulletin is never marked as resolved. If this is added, we should support that here
  $scope.bulletinsOpen = [];
  $scope.bulletinsExpired = [];

  $http.get('/profile/me').success(function(data) {
    $scope.user = data;
    var baseUrl = '/messages?user_id=' + $scope.user.id;
    // Get requests
    $http.get(baseUrl + "&offer=0").success(function(data) { 
    	_.each(data.users, function(elem, index) {
		    $scope.requests.push({ 
		    	'user': elem,
		    	'history': data.histories[index]
		   	});
		  });
    });
    // Get offers
    $http.get(baseUrl + "&offer=1").success(function(data) {    	
    	_.each(data.users, function(elem, index) {
		    $scope.offers.push({ 
		    	'user': elem,
		    	'history': data.histories[index]
		   	});
		  });
    });
    // Get bulletins
    $http.get('/bulletins/me').success(function(bulletins) {
      $scope.bulletinsOpen = _.remove(bulletins, function(bulletin) {
        return bulletin.status === 'open'
      });
      $scope.bulletinsExpired = _.remove(bulletins, function(bulletin) {
        return bulletin.status === 'expired'
      });
    });    
  });

  $scope.deleteBulletin = function(bulletinID) {
    $http.delete('/bulletins/' + bulletinID).success(function() {
      _.remove($scope.bulletins, function(bulletin) {
        return bulletin.id === bulletinID;
      })
    });
  };

  $scope.editBulletin = function(bulletinID) {
    $location.path('/bulletins/' + bulletinID + '/edit');
  };
};

MessageCtrl.$inject = ['$scope', '$http', '$routeParams', '$location', '$window'];