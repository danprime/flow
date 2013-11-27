//Initialize function
var screen = 0;
var init = function () {
    // TODO:: Do your initialization job
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
        {
        	switch(screen)
        	{	
        		case 1:
        			window.location.href ="#/stages";
        			break;
        		case 2:
        			window.location.href = "#/stages";
        		case 3:
        			window.location.href = "#/stages";
        			break;
        		default:
        			tizen.application.getCurrentApplication().exit();
    				break;
        	}
        }
    });
};
// window.onload can work without <body onload="">
window.onload = init;

var app = angular.module('flowapp', ['ngRoute']);

app.filter('indexInSet', function() {
	return function(input, arraySet) {
		var out =[];
		
		angular.forEach(arraySet, function(value, key){
			out.push(input[value]);
		});
		
		return out;
	}
});

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
        "crm":[{"id":"1", "fields":["Joe1","100","JoeNotes"], "stageId":"1"},{"id":"2", "fields":["Jane2","200","JaneNotes"], "stageId":"1"}]}}
,{"name":"Event", "id":"2", "pipeline":{
    "stages":[{"stageId":"1", "stageName":"Working", "stageColour":"teal"}, {"stageId":"2", "stageName":"Finalized", "stageColour":"orange"}, {"stageId":"3", "stageName":"Booked", "stageColour":"red"}, {"stageId":"4", "stageName":"Paid For", "stageColour":"green"}],
    "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                {"fieldName":"Description", "fieldType":"text", "display":"no"}
                ,{"fieldName":"Amount", "fieldType":"number", "display":"yes"}],
    "crm":[{"id":"1", "fields":["Frank1","FrankDesc","10"], "stageId":"1"},{"id":"2", "fields":["Anne2","AnneDesc","10"], "stageId":"2"}]}}];;
	var currentFlow = myFlows[0];
	var currentIndex = 0;
	var currentStageId;
	var currentBoxId;
	
	return {
		init: function()
		{
			var loadedFlows = JSON.parse(localStorage.getItem("flows"));
			if (loadedFlows != null)
			{
				myFlows = loadedFlows;
			}
		},
		load: function()
		{			
			return myFlows;
		},
		save: function(flows)
		{
			console.log("Saving...");
			myFlows = flows;
			localStorage.setItem("flows", JSON.stringify(myFlows));
		},
		setCurrentFlowIndex: function(flowIndex)
		{
			currentIndex = flowIndex;
			currentFlow = myFlows[flowIndex];
		},
		getCurrentFlowIndex: function()
		{
			return currentIndex;
		},
		setCurrentStageId: function(stageId)
		{
			currentStageId = stageId;
		},
		getCurrentStageId: function()
		{
			return currentStageId;
		},
		setCurrentBoxId: function(boxId)
		{
			currentBoxId = boxId;
		},
		getCurrentBoxId: function()
		{
			return currentBoxId;
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
	
	dataServices.init();
	screen = 0;
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
		dataServices.save($scope.pipelines);
		dataServices.setCurrentStageId(stageid);
		$location.path('/stageview/' + stageid);
	}
	
	//Auto-Save
	window.setInterval(function(){
		if (screen >= 2)
		dataServices.save($scope.pipelines)}, 10000);
	
}

function stageViewCtrl($scope, $location, dataServices, idservice) {
	screen = 1;
	$scope.selectedStageId = dataServices.getCurrentStageId();
	$scope.pipelines = dataServices.load();	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	$scope.stages = $scope.flow.pipeline.stages;
	$scope.fields = $scope.flow.pipeline.fields;
	$scope.crm = $scope.flow.pipeline.crm;
	
	$scope.newFields = new Array();
		
	$scope.visibleFieldIndexes = new Array();
	
	//DOC: Get the the visible indexes for filtering.
	angular.forEach($scope.fields, function(field, key){
		if (field.display  == "yes")
		{
			$scope.visibleFieldIndexes.push(key);
		}
	});
	
	$scope.openBox = function(boxID)
	{
		dataServices.save($scope.pipelines);
		dataServices.setCurrentBoxId(boxID);
		$location.path('/personview/' + boxID);
	}
	
	$scope.gotoStages = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stages');
	}
	
	$scope.addClient = function()
	{
		var newBox = new Object();
		newBox.id = idservice.gen();
		newBox.stageId = angular.copy($scope.selectedStageId);
		newBox.fields = $scope.newFields;
		
		$scope.crm.push(newBox);
		dataServices.save($scope.pipelines);
	}
}

function personViewCtrl($scope, $location, dataServices) {
	screen = 2;
	$scope.selectedStageId = dataServices.getCurrentStageId();
	$scope.pipelines = dataServices.load();	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	$scope.stages = $scope.flow.pipeline.stages;
	$scope.fields = $scope.flow.pipeline.fields;
	$scope.crm = $scope.flow.pipeline.crm;
	$scope.currentBoxId = dataServices.getCurrentBoxId();
	
	$scope.stageName = _.where($scope.stages, {stageId:$scope.selectedStageId})[0].stageName
	
	
	//Get the first (only one) - ideally should be a filter?
	$scope.client = _.where( $scope.crm, {id:$scope.currentBoxId})[0];
	
	
	$scope.goBack = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stageview/' + $scope.selectedStageId);
	}
	
	$scope.deleteClient = function()
	{	
		var targetIndex = $scope.crm.indexOf($scope.client);
		if (targetIndex != -1)
		{
			$scope.crm.splice(targetIndex, 1);
		}
		dataServices.save($scope.pipelines);
		$scope.goBack();
	}
	
	$scope.save = function()
	{
		dataServices.save($scope.pipelines);
	}
}

function settingsCtrl($scope, $location, dataServices, idservice) {
	screen = 3;
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
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.changeFlowName = function(newName)
	{
		if ( newName.trim().length > 0)
		{
			$scope.currentPipeline.name = newName;
			$scope.newNameForCurrentFlow = "";
		}
		
		dataServices.save($scope.pipelines);
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
		
		dataServices.save($scope.pipelines);
	}
	$scope.addNewStage = function(stage)
	{
		stage.stageId = idservice.gen();
		
		if (stage.stageColour == null)
		{
			//randomly pick a colour.
			stage.stageColour = $scope.availableColours[Math.floor(Math.random() * $scope.availableColours.length)];
		}
		$scope.currentPipeline.pipeline.stages.push(stage);
		$scope.newStage = "";
		
		dataServices.save($scope.pipelines);
	}

	
	$scope.deleteStage = function(stage)
	{
		var targetIndex = $scope.currentPipeline.pipeline.stages.indexOf(stage);
		if (targetIndex != -1)
		{
			$scope.currentPipeline.pipeline.stages.splice(targetIndex, 1);
		}
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.createNewFlow = function(newFlowName)
	{
		var newPipeLine = new Object();
		newPipeLine.name = $scope.newFlowName;
		newPipeLine.id = idservice.gen();
		newPipeLine.pipeline = new Object();
		newPipeLine.pipeline.stages = new Array();
		newPipeLine.pipeline.fields = new Array();
		newPipeLine.pipeline.crm = new Array();		
		
		$scope.pipelines.push(newPipeLine);
		
		$scope.newFlowName = "";
		
		$scope.selectedPipeline = newPipeLine;
		$scope.switchPipeline();
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.addField = function(targetField)
	{
		targetField.display = "no";
		$scope.currentPipeline.pipeline.fields.push(targetField);
		$scope.newField = "";
		
		dataServices.save($scope.pipelines);
	}
	$scope.removeField = function(targetField)
	{
		var targetIndex = $scope.currentPipeline.pipeline.fields.indexOf(targetField);
		if (targetIndex != -1)
		{
			$scope.currentPipeline.pipeline.fields.splice(targetIndex, 1);
		}
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.gotoStages = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stages');
	}
	
	$scope.deleteFlow = function()
	{
		if ($scope.currentPipeline == $scope.selectedPipeline)
		{
			var targetIndex = $scope.pipelines.indexOf($scope.currentPipeline);
			if (targetIndex != -1)
			{
				$scope.pipelines.splice(targetIndex, 1);
				
				$scope.selectedPipeline = $scope.pipelines[0];
				$scope.switchPipeline();
				
			}
		}
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.save = function()
	{
		dataServices.save($scope.pipelines);
	}
}