//Initialize function
var init = function () {
    // TODO:: Do your initialization job
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};
// window.onload can work without <body onload="">
window.onload = init;

var app = angular.module('flowapp', ['ngRoute']);

app.factory('idservice', function() {
	
	var s4 = function () {
		  return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
	};

	
	return {
		gen: function()
		{
			return s4() + s4() + '-' + s4();
		}
	}
	
});

app.factory('dataServices', function(){
	var myFlows = [{"name":"Sales", "id":"1", "pipeline":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"teal"}, {"stageId":"2", "stageName":"Contacted", "stageColour":"orange"}, {"stageId":"3", "stageName":"Pitched", "stageColour":"red"}, {"stageId":"4", "stageName":"Sold", "stageColour":"green"}],
        "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                    {"fieldName":"Amount", "fieldType":"number", "display":"yes"}
                    ,{"fieldName":"Notes", "fieldType":"text", "display":"no"}],
        "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"1"}]}}
,{"name":"Event", "id":"2", "pipeline":{
    "stages":[{"stageId":"1", "stageName":"Working", "stageColour":"teal"}, {"stageId":"2", "stageName":"Finalized", "stageColour":"orange"}, {"stageId":"3", "stageName":"Booked", "stageColour":"red"}, {"stageId":"4", "stageName":"Paid For", "stageColour":"green"}],
    "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                {"fieldName":"Description", "fieldType":"text", "display":"no"}
                ,{"fieldName":"Amount", "fieldType":"number", "display":"yes"}],
    "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"2"}]}}];;
	var currentFlow = myFlows[0];
	var currentIndex = 0;
	return {
		load: function()
		{
			return myFlows;
		},
		save: function(flows)
		{
			myFlows = flows;
			console.log("saving...");
		},
		setCurrentFlowIndex: function(flowIndex)
		{
			currentIndex = flowIndex;
			currentFlow = myFlows[flowIndex];
		},
		getCurrentFlowIndex: function()
		{
			return currentIndex;
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

function stagesCtrl($scope, $location, dataServices) {
	
	$scope.pipelines = dataServices.load();
	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	
	$scope.stages = $scope.flow.pipeline.stages;
	
	$scope.stageBoxHeight = (window.innerHeight - 100) / $scope.stages.length;
	
	angular.forEach($scope.stages, function(stage, key){
		
		crms = _.where( $scope.flow.pipeline.crm, {stageId:stage.stageId});
		stage.count = crms.length;
	});
	
	$scope.viewStage = function(stageid)
	{
		$location.path('/stageview/' + stageid);
	}
	
}

function stageViewCtrl($scope, $location) {
	
}

function personViewCtrl($scope, $location) {
	
}

function settingsCtrl($scope, $location, dataServices, idservice) {
	$scope.availableColours = Array('aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow');
	
	$scope.pipelines = dataServices.load();
	
	$scope.selectedPipeline = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	
	//DOC: If nothing is selected, select the first one.
	if ($scope.selectedPipeline == null)
	{
		$scope.selectedPipeline = $scope.pipelines[0];
	}
	
	$scope.currentPipeline = $scope.selectedPipeline;
	
	$scope.switchPipeline = function()
	{
		if (angular.equals($scope.currentPipeline, $scope.selectedPipeline) == false)
		{
			var newIndex = $scope.pipelines.indexOf($scope.selectedPipeline);
			dataServices.setCurrentFlowIndex(newIndex);
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
		stage.stageId = idservice.gen()
		console.log("Stage Id:" + stage.stageId);
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
		newPipeLine = {"name":"Sales", "id":"1", "pipeline":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"yellow"}, {"stageName":"Contacted", "stageColour":"orange"}, {"stageName":"Pitched", "stageColour":"red"}, {"stageName":"Sold", "stageColour":"green"}],
	        "fields":[{"fieldName":"a", "fieldType":"text", "display":"no"}, 
	                    {"fieldName":"b", "fieldType":"number", "display":"no"}
	                    ,{"fieldName":"c", "fieldType":"text", "display":"no"}
	                    ,{"fieldName":"d", "fieldType":"number", "display":"yes"}],
	        "crm":[{"contactid":"1", "field1":"val1", "field2":"val2", "stageId":"stage1"},{"contactid":"2", "field1":"val1", "field2":"val2", "stageId":"stage1"}]}}
	;
		newPipeLine.name = newFlowName;
		newPipeLine.id = idservice.gen();
		
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
