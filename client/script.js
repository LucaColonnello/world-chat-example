// declare a module
var app = angular.module('myApp', []);

app.controller('FirstController', function($scope){
	$scope.hello = "Hello!!";
	$scope.name ="Alessio";
	$scope.lista=[1,2];
	
	$scope.newUser = {
		name: "",
		eta: 0
	};
	
	$scope.listaOgg=[
		{
			name:"luca",
			eta:24
		},
		{
			name:"Alessio",
			eta:24
		}
		
	];
	$scope.count = function(){
		return $scope.listaOgg.length;
	};
	
	$scope.addUser = function(){
		$scope.listaOgg.push( Object.create( $scope.newUser ) );
		$scope.newUser = {
			name: "",
			eta: 0
		};
	};

});