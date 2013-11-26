//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};
// window.onload can work without <body onload="">
window.onload = init;

var app = angular.module('flowapp', ['ngRoute']);


app.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/stages', {templateUrl: 'partials/stages.html', controller: 'stagesCtrl'});
	  $routeProvider.when('/stageview/:stageid', {templateUrl: 'partials/stageview.html', controller: 'stageViewCtrl'});
	  $routeProvider.when('/personview/:personid', {templateUrl: 'partials/personview.html', controller: 'personViewCtrl'});
	  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'settingsCtrl'});
	  $routeProvider.otherwise({redirectTo: '/stages'});
	}]);

function stagesCtrl($scope) {
	
}

function stageViewCtrl($scope) {
	
}

function personViewCtrl($scope) {
	
}

function settingsCtrl($scope) {
	
}
