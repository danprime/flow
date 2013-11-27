//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    console.log("window height:"+ window.innerHeight + " width:" + window.innerWidth);
};
// window.onload can work without <body onload="">
window.onload = init;

var app = angular.module('flowapp', ['ngRoute']);

app.factory('dataServices', function(){
	var myflows = new Object();	
	
	return {
		load: function()
		{
			console.log("loading");
		},
		save: function()
		{
			console.log("saving...");
		},
		getFlow: function(id)
		{
			
		},
		getFlows: function()
		{
			return myflows;
		}
	}
});

//Routes
app.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/stages', {templateUrl: 'partials/stages.html', controller: 'stagesCtrl'});
	  $routeProvider.when('/stageview/:stageid', {templateUrl: 'partials/stageview.html', controller: 'stageViewCtrl'});
	  $routeProvider.when('/personview/:personid', {templateUrl: 'partials/personview.html', controller: 'personViewCtrl'});
	  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'settingsCtrl'});
	  $routeProvider.otherwise({redirectTo: '/stages'});
	}]);

function stagesCtrl($scope, $location) {
	
	$scope.pipeline = {"pipeline1":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"yellow"}, {"stageName":"Contacted", "stageColour":"orange"}, {"stageName":"Pitched", "stageColour":"red"}, {"stageName":"Sold", "stageColour":"green"}],
	        "fields":[{"fieldName":"a", "fieldType":"text", "display":"yes/no"}, 
	                    {"fieldName":"b", "fieldType":"number", "display":"yes/no"}
	                    ,{"fieldName":"c", "fieldType":"text", "display":"yes/no"}
	                    ,{"fieldName":"d", "fieldType":"number", "display":"yes/no"}],
	        "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"stage1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"stage1"}]}};
	
	$scope.stages = $scope.pipeline.pipeline1.stages;
	
	$scope.stageBoxHeight = (window.innerHeight - 100) / $scope.stages.length;
	
	$scope.viewStage = function(stageid)
	{
		$location.path('/stageview/' + stageid);
	}
	
}

function stageViewCtrl($scope, $location) {
	
}

function personViewCtrl($scope, $location) {
	
}

function settingsCtrl($scope, $location) {
	$scope.availableColours = Array('aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow');
		
	$scope.pipelines = [{"name":"Sales", "id":"1", "pipeline":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"yellow"}, {"stageName":"Contacted", "stageColour":"orange"}, {"stageName":"Pitched", "stageColour":"red"}, {"stageName":"Sold", "stageColour":"green"}],
	        "fields":[{"fieldName":"a", "fieldType":"text", "display":"no"}, 
	                    {"fieldName":"b", "fieldType":"number", "display":"no"}
	                    ,{"fieldName":"c", "fieldType":"text", "display":"no"}
	                    ,{"fieldName":"d", "fieldType":"number", "display":"yes"}],
	        "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"stage1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"stage1"}]}}
	,{"name":"Ideas", "id":"2", "pipeline":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"yellow"}, {"stageName":"Contacted", "stageColour":"orange"}, {"stageName":"Pitched", "stageColour":"red"}, {"stageName":"Sold", "stageColour":"green"}],
        "fields":[{"fieldName":"a", "fieldType":"text", "display":"yes/no"}, 
                    {"fieldName":"b", "fieldType":"number", "display":"yes/no"}
                    ,{"fieldName":"c", "fieldType":"text", "display":"yes/no"}
                    ,{"fieldName":"d", "fieldType":"number", "display":"yes/no"}],
        "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"stage1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"stage1"}]}}];
	
	$scope.currentPipeline = "";
	
	$scope.selectedPipeline; //TODO Add a watch on this?
	
	//DOC: If nothing is selected, select the first one.
	if ($scope.selectedPipeline == null)
	{
		$scope.selectedPipeline = $scope.pipelines[0];
		$scope.currentPipeline = $scope.selectedPipeline;
	}
	
	$scope.switchPipeline = function()
	{
		if (angular.equals($scope.currentPipeline, $scope.selectedPipeline) == false)
		{
			$scope.currentPipeline = $scope.selectedPipeline;
		}
	}
	
	$scope.changeFlowName = function(newName)
	{
		if ( newName.trim().length > 0)
		{
			$scope.currentPipeline.name = newName;
			$scope.newNameForCurrentFlow = "";
		}
	}
	
	$scope.changeOrder = function(stage, direction)
	{
		//Find the index
		var sourceIndex = $scope.currentPipeline.pipeline.stages.indexOf(stage);
		var maxIndex = $scope.currentPipeline.pipeline.stages.length - 1;

		if ((direction == -1) && (sourceIndex != 0))
		{
			var temp = $scope.currentPipeline.pipeline.stages[sourceIndex - 1];
			$scope.currentPipeline.pipeline.stages[sourceIndex - 1] = stage;
			$scope.currentPipeline.pipeline.stages[sourceIndex] = temp;
		}
		
		else if ((direction == 1) && (sourceIndex != maxIndex))
		{
			var temp = $scope.currentPipeline.pipeline.stages[sourceIndex + 1];
			$scope.currentPipeline.pipeline.stages[sourceIndex + 1] = stage;
			$scope.currentPipeline.pipeline.stages[sourceIndex] = temp;
		}
	}
	$scope.addNewStage = function(stage)
	{
		$scope.currentPipeline.pipeline.stages.push(stage);
		$scope.newStage = "";
	}

	
	$scope.deleteStage = function(stage)
	{
		var targetIndex = $scope.currentPipeline.pipeline.stages.indexOf(stage);
		if (targetIndex != -1)
		{
			$scope.currentPipeline.pipeline.stages.splice(targetIndex, 1);
		}
	}
	
	$scope.createNewFlow = function(newFlowName)
	{
		var newPipeline = new Object();
		newPipeline.name = newFlowName;
		newPipeline.id = "";
		newPipeline.pipelines = new Object();
		newPipeline.pipelines.stages = Array();
		
		$scope.pipelines.push(newPipeline);
	}
	
	$scope.addField = function(targetField)
	{
		$scope.currentPipeline.pipeline.fields.push(targetField);
		$scope.newField = "";
	}
	$scope.removeField = function(targetField)
	{
		var targetIndex = $scope.currentPipeline.pipeline.fields.indexOf(targetField);
		if (targetIndex != -1)
		{
			$scope.currentPipeline.pipeline.fields.splice(targetIndex, 1);
		}
	}
	
}
