// declare a module
var app = angular.module('worldChat', ["ngRoute"]);

app.config( function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }).
      when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
} );

app.factory('user', function () {
  return {
	username:""
  };
});

//factory socket chat
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller("HomeCtrl",function($scope,$location,user){
	$scope.user=user;
	$scope.submit=function(){
		if($scope.user.username==""){
			alert("E' necessario inserire un nome utente per accedere alla chat.");		
			return;
		}
			
		$location.path("/chat");
	};
});

app.controller("ChatCtrl",function($scope,$location,socket,user){
	$scope.user = user;
	
	if($scope.user.username == ""){
		$location.path("/");		
		return;
	}
	
	$scope.newMessage = {
		username: $scope.user.username,
		message: ''
	};
	$scope.messages = [ ];
	
	
	socket.on( "newMessageSent", function( data ) {
		$scope.messages.push( data );
	} );
	
	$scope.submit = function( ){
		socket.emit( "postMessage", $scope.newMessage );
		$scope.newMessage = {
			username: $scope.user.username,
			message: ''
		};
	};
	
});
