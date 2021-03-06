angular.module('main', ['housing.search', 'housing.searchFromProfile', 'housing.result', 'housing.service', 'housing.loading', 'housing.auth', 'housing.profile','ngRoute'])
.config(function($routeProvider, $httpProvider) { // all routers here
	$routeProvider
	.when('/signin', { // routes to signin page
    templateUrl: 'authentication/signin.html',
    controller: 'AuthController'
  })
  .when('/signup', { // routes to signup page
    templateUrl: 'authentication/signup.html',
    controller: 'AuthController'
  })
	.when('/result', { // routes to result page
		templateUrl: 'resultPage/result.html',
		controller: 'ResultController'
	})
	.when('/profile', { // routes to profile page
    templateUrl: 'profilePage/profile.html',
    controller: 'profileController'
  })
	.when('/search', { // routes to search page
		templateUrl: 'searchPage/search.html',
		controller: 'SearchController'
	})
  .when('/searchFromProfile', { // routes to searchFromProfile page
    templateUrl: 'searchPage/search.html',
    controller: 'SearchFromProfileController'
  })
	.when('/loading', { // routes to loading page
		templateUrl: 'loadingPage/loading.html',
    controller: 'LoadingController'
	})
	.otherwise({ // other routes will be led to search page
		redirectTo: '/search'
	})
})
.factory('GoogleMap', function() { // a factory that generates google map for search results
	function googleMapsInitialize(listings, neighbourhood) {
    var labels = '12345';
    markerArr = [];
    var lonsum = 0;
    var latsum = 0;
    var counter = 0;
    var i=0;

    for (var i=0; i<listings[neighbourhood].length; i++) {
        var lat1 = parseFloat(listings[neighbourhood][i].lat);
        var lon1 = parseFloat(listings[neighbourhood][i].lon);
        lonsum+=lon1;
        latsum+=lat1;

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat1, lon1),
            label: labels[i]
        });

        markerArr.push(marker);
        counter+=1;
 		}

    var total = Math.min(counter, 5);
    var myCenter = new google.maps.LatLng(latsum/total, lonsum/total);
 
		var mapProp = {
		  center: myCenter,
		  zoom:15,
		  mapTypeId:google.maps.MapTypeId.ROADMAP
		};

	 	var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	 // console.log(markerArr);

	 	markerArr.forEach(function(marker) {
	    marker.setMap(map);
	 	});
	};
	return {
		googleMapsInitialize: googleMapsInitialize
	};
})
.factory('Auth', function ($http, $location, $window) { // a factory that generates authentication methods
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/search');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});

