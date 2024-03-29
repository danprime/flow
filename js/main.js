//Initialize function
var screen = 0;
var contentManager = tizen.content;
var previousBoxId = 0;
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
        		case 4:
        			window.location.href = "#/personview/"+previousBoxId;
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

app.factory('linkedContentServices', function() {
	var directories = new Array();
	var currentDirectoryListing = new Array();
	
	return {
		getDirectories: function()
		{
			return directories;
			
		},
		setDirectories: function(newDirectoryListing)
		{
			directories = newDirectoryListing;
		},
		contentGetDirectorySuccess: function(directories)
		{
			directories = new Array();
			angular.forEach(directories, function(directory, key){
				directories.push(directory);
			});
		},
		getDirectoryListing: function(directoryId)
		{
			
		}
	}
	
});

app.factory('dataServices', function(){
	var myFlows = [{"name":"Sales", "id":"1", "pipeline":{
	    "stages":[{"stageId":"1", "stageName":"Lead", "stageColour":"teal"}, {"stageId":"2", "stageName":"Contacted", "stageColour":"orange"}, {"stageId":"3", "stageName":"Pitched", "stageColour":"red"}, {"stageId":"4", "stageName":"Sold", "stageColour":"green"}],
        "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                    {"fieldName":"Amount", "fieldType":"number", "display":"yes"}
                    ,{"fieldName":"Description", "fieldType":"text", "display":"no"}],
        "crm":[{"id":"1", "fields":["Joe","100",""], "stageId":"1"},{"id":"2", "fields":["Jane","200",""], "stageId":"1"}]}}
,{"name":"Event", "id":"2", "pipeline":{
    "stages":[{"stageId":"a1", "stageName":"Working", "stageColour":"teal"}, {"stageId":"a2", "stageName":"Finalized", "stageColour":"orange"}, {"stageId":"a3", "stageName":"Booked", "stageColour":"red"}, {"stageId":"a4", "stageName":"Paid For", "stageColour":"green"}],
    "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                {"fieldName":"Description", "fieldType":"text", "display":"no"}
                ,{"fieldName":"Amount", "fieldType":"number", "display":"yes"}],
    "crm":[{"id":"a1", "fields":["Frank","FrankDesc","10"], "stageId":"a1"},{"id":"a2", "fields":["Anne","AnneDesc","10"], "stageId":"a2"}]}}
,{"name":"Bug Tracking", "id":"3", "pipeline":{
    "stages":[{"stageId":"b1", "stageName":"Reported", "stageColour":"teal"}, {"stageId":"b2", "stageName":"Working", "stageColour":"orange"}, {"stageId":"b3", "stageName":"Not Reproducible", "stageColour":"red"}, {"stageId":"b4", "stageName":"Not Fixing Now", "stageColour":"green"}, {"stageId":"5", "stageName":"Review", "stageColour":"aqua"}, {"stageId":"6", "stageName":"Fixed", "stageColour":"blue"}],
    "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                {"fieldName":"Description", "fieldType":"text", "display":"no"}
                ,{"fieldName":"Priority", "fieldType":"number", "display":"yes"}],
    "crm":[{"id":"b1", "fields":["Localization","English is Incorrect","1"], "stageId":"b1"},{"id":"b2", "fields":["Branding","Change Graphics","2"], "stageId":"b1"}]}}
,{"name":"Lending", "id":"4", "pipeline":{
    "stages":[{"stageId":"c1", "stageName":"Lent", "stageColour":"teal"}, {"stageId":"c2", "stageName":"Notified", "stageColour":"orange"}, {"stageId":"c3", "stageName":"Paid Back", "stageColour":"green"}, {"stageId":"c4", "stageName":"Late", "stageColour":"red"}],
    "fields":[{"fieldName":"Name", "fieldType":"text", "display":"yes"}, 
                {"fieldName":"Amount", "fieldType":"number", "display":"yes"}
                ],
    "crm":[{"id":"c1", "fields":["Joe", "150.00"], "stageId":"c1"},{"id":"c2", "fields":["Frank", "450.00"], "stageId":"c3"},{"id":"c3", "fields":["Monica", "20.50"], "stageId":"2"}]}}];;
	var currentFlow = myFlows[0];
	var currentIndex = 0;
	var currentStageId;
	var currentBoxId;
	
	var observerCallbacks = [];
	
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
		},
		registerObserverCallback: function(callback){
		    observerCallbacks.push(callback);
		},
		notifyObservers: function(){
		    angular.forEach(observerCallbacks, function(callback){
		        callback();
		      });
		    }

	}
});

//Routes
app.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/stages', {templateUrl: 'partials/stages.html', controller: 'stagesCtrl'});
	  $routeProvider.when('/stageview/:stageid', {templateUrl: 'partials/stageview.html', controller: 'stageViewCtrl'});
	  $routeProvider.when('/personview/:personid', {templateUrl: 'partials/personview.html', controller: 'personViewCtrl'});
	  $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'settingsCtrl'});
	  $routeProvider.when('/filePicker', {templateUrl: 'partials/filePicker.html', controller: 'filePickerCtrl'});
	  $routeProvider.otherwise({redirectTo: '/stages'});
	}]);

function navController($scope, dataServices) {
	$scope.title;
	$scope.pipelines = dataServices.load();
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	
	$scope.title = $scope.flow.name;
	
	$scope.update = function()
	{
		$scope.pipelines = dataServices.load();
		$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
		
		$scope.title = $scope.flow.name;
	}
	
	dataServices.registerObserverCallback($scope.update);
}

function stagesCtrl($scope, $location, dataServices) {
	
	dataServices.init();
	screen = 0;
	$scope.pipelines = dataServices.load();
	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	
	$scope.stages = $scope.flow.pipeline.stages;
	
	$scope.stageBoxHeight = (window.innerHeight - 53) / $scope.stages.length;
	
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
	
	$scope.visibleFields = new Array();
	
	$scope.refreshStageCount = function ()
	{
		angular.forEach($scope.stages, function(stage, key){
			
			crms = _.where( $scope.flow.pipeline.crm, {stageId:stage.stageId});
			stage.count = crms.length;
		});
		
		dataServices.save($scope.pipelines);
	}
	//DOC: Get the the visible indexes for filtering.
	angular.forEach($scope.fields, function(field, key){
		if (field.display  == "yes")
		{
			$scope.visibleFieldIndexes.push(key);
			$scope.visibleFields.push(field);
		}
	});	
	
	$scope.refreshStageCount();
	
	
	$scope.openBox = function(boxID)
	{
		dataServices.save($scope.pipelines);
		dataServices.setCurrentBoxId(boxID);
		$location.path('/personview/' + boxID);
	}
	
	$scope.addBox = function()
	{
		dataServices.save($scope.pipelines);
		dataServices.setCurrentBoxId(-99);
		$location.path('/personview/-99');
	}
	
	$scope.viewStage = function(stageid)
	{
		dataServices.save($scope.pipelines);
		dataServices.setCurrentStageId(stageid);
		$location.path('/stageview/' + stageid);
	}
	
	$scope.gotoStages = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stages');
	}
}

function personViewCtrl($scope, $location, dataServices, linkedContentServices, idservice) {
	screen = 2;
	$scope.selectedStageId = dataServices.getCurrentStageId();
	$scope.pipelines = dataServices.load();	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	$scope.stages = $scope.flow.pipeline.stages;
	$scope.fields = $scope.flow.pipeline.fields;
	$scope.crm = $scope.flow.pipeline.crm;
	$scope.currentBoxId = dataServices.getCurrentBoxId();
	$scope.possibleContent = new Array();
	$scope.directoryListing = new Array();
	
	$scope.stageName = _.where($scope.stages, {stageId:$scope.selectedStageId})[0].stageName
	$scope.targetContent = new Array();
	
	$scope.deleteFileConfirm = false;
	$scope.targetFile;
	
	if ($scope.currentBoxId == -99)
	{
		$scope.client = new Object();
		$scope.client.id = -99;
		$scope.client.fields = new Array($scope.fields.length);		
		$scope.client.stageId =$scope.selectedStageId;
	}
	else if ($scope.currentBoxId != -99)
	{
	
		//Get the first (only one) - ideally should be a filter?
		$scope.client = _.where( $scope.crm, {id:$scope.currentBoxId})[0];
	
		
	}
	
	if ($scope.client.linkedContent == null){
		$scope.client.linkedContent = new Array();
	}
	
	$scope.linkedContent = $scope.client.linkedContent;
	
	$scope.refreshStageCount = function ()
	{
		angular.forEach($scope.stages, function(stage, key){
			
			crms = _.where( $scope.flow.pipeline.crm, {stageId:stage.stageId});
			stage.count = crms.length;
		});
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.goBack = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stageview/' + $scope.selectedStageId);
	}
	
	$scope.confirmBoxDelete = function()
	{

		var targetIndex = $scope.crm.indexOf($scope.potentialBox);
		if (targetIndex != -1)
		{
			$scope.crm.splice(targetIndex, 1);
		}
		dataServices.save($scope.pipelines);
		$scope.deleteBoxConfirm = false;
		dataServices.save($scope.pipelines);
		$scope.goBack();
	}
	
	$scope.cancelBoxDelete = function()
	{
		$scope.deleteBoxConfirm = false;
	}
	
	$scope.deleteClient = function()
	{	
		$scope.deleteBoxConfirm = true;
		$scope.potentialBox =$scope.client;
		
	}
	
	$scope.cancelAddNewBox = function()
	{
		$scope.goBack();
	}
	
	$scope.addNewBox = function()
	{
		//Take the current box and add it to the list.		
		$scope.client.id = idservice.gen();
		$scope.currentBoxId = $scope.client.id; 
		dataServices.setCurrentBoxId($scope.client.id);
		$scope.crm.push($scope.client);
		dataServices.save($scope.pipelines);
		
		$scope.refreshStageCount();
		console.log("Saved...");
	}
	
	$scope.viewStage = function(stageid)
	{
		dataServices.save($scope.pipelines);
		dataServices.setCurrentStageId(stageid);
		$location.path('/stageview/' + stageid);
	}
	
	$scope.save = function()
	{
		dataServices.save($scope.pipelines);
	}
	
	$scope.addFileClick = function()
	{
		previousBoxId = $scope.currentBoxId;
		$location.path('/filePicker');
	}
	
//
	$scope.confirmFileDelete = function()
	{

		var targetIndex = $scope.client.linkedContent.indexOf($scope.targetFile);
		if (targetIndex == -1)
		{
			return ;
		}
		
		$scope.client.linkedContent.splice(targetIndex, 1);
		
		dataServices.save($scope.pipelines);
		$scope.deleteFileConfirm = false;
	}
	
	$scope.cancelFileDelete = function()
	{
		$scope.deleteFileConfirm = false;
	}
	
	$scope.unlink = function(lContent)
	{	
		$scope.targetFile = lContent;
		$scope.deleteFileConfirm = true;
	}
	
	$scope.openLContent = function (contentEntry)
	{
		//Get the URI and mime type
		tizen.application.launchAppControl(new tizen.ApplicationControl(
				'http://tizen.org/appcontrol/operation/view',
				contentEntry.contentURI,
				contentEntry.mimeType
			),
				null,
				function () {
					setTimeout(function () {
						self.openFileUnLocked = true;
					}, 500);
				},
				function (e) {
					self.openFileUnLocked = true;
					console.error('Service launch failed. Exception message:' + e.message);
				},
				null//serviceReplyCB
				);
	}
	
	$scope.addClient = function()
	{
		if (($scope.newFields[0] == null) || ($scope.newFields[0].trim().length == 0))
		{
			return;
		}
		var newBox = new Object();
		newBox.id = idservice.gen();
		newBox.stageId = angular.copy($scope.selectedStageId);
		newBox.fields = $scope.newFields;
		
		$scope.crm.push(newBox);
		dataServices.save($scope.pipelines);
		$scope.newFields = "";
		$scope.refreshStageCount();
	}
	
}

function settingsCtrl($scope, $location, dataServices, idservice) {
	screen = 3;
	$scope.availableColours = Array('aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow');
	
	$scope.pipelines = dataServices.load();
	
	$scope.selectedPipeline = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	
	$scope.deleteStageConfirm = "false";
	$scope.potentialStage;
	$scope.deleteFieldConfirm = "false";
	$scope.potentialField;	
	$scope.deleteFlowConfirm = "false";
	$scope.potential;
	
	$scope.errorMessageDisplay = false;
	$scope.errorMessage = "";
	
	$scope.fields = $scope.selectedPipeline.pipeline.fields;
	$scope.crm = $scope.selectedPipeline.pipeline.crm;
	
	$scope.documentsDir = "";
	
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
		
		dataServices.notifyObservers();
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
		if ((stage == null) ||(stage.stageName == null) || (stage.stageName.trim().length == 0))
		{
			return;
		}
		
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

	$scope.confirmStageDelete = function()
	{
		var targetIndex = $scope.currentPipeline.pipeline.stages.indexOf($scope.potentialStage);
		if (targetIndex != -1)
		{
			$scope.currentPipeline.pipeline.stages.splice(targetIndex, 1);
		}
		
		dataServices.save($scope.pipelines);
		$scope.deleteStageConfirm = false;
	}
	
	$scope.cancelStageDelete = function()
	{
		$scope.deleteStageConfirm = false;
	}
	
	$scope.deleteStage = function(stage)
	{
		var blockDelete = false;
		//Check to see if there are any boxes in that stage.
		angular.forEach($scope.crm, function(box, boxKey){			
			if ((blockDelete == false) && (box.stageId == stage.stageId))
			{
				//Cannot delete as there are boxes in this stage.
				blockDelete = true;
			}
		});
		
		if (blockDelete == false)
		{	
			$scope.deleteStageConfirm = true;
			$scope.potentialStage = stage;
		} else {
			console.log("Cannot delete stage because there are boxes in the stage.");
			
			$scope.errorMessageDisplay = true;
			$scope.errorMessage = "Cannot remove stage because there are boxes with this stage please move boxes out of this stage and try again.";
		}
	}
	
	$scope.cancelErrorMessage = function()
	{
		$scope.errorMessageDisplay = false;
	}
	
	$scope.createNewFlow = function(newFlowName)
	{
		if (($scope.newFlowName == null) || ($scope.newFlowName.trim().length == 0))
		{
			return ;
		}
		
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
		if ((targetField == null) ||(targetField.fieldName == null) || (targetField.fieldName.trim().length == 0))
		{
			return;
		}
		
		targetField.display = "no";
		$scope.currentPipeline.pipeline.fields.push(targetField);
		$scope.newField = "";
		
		dataServices.save($scope.pipelines);
	}
	
	$scope.confirmFieldDelete = function()
	{
		var targetFieldIndex = $scope.fields.indexOf($scope.potentialField);
		var targetIndex = $scope.currentPipeline.pipeline.fields.indexOf($scope.potentialField);
		
		if ((targetFieldIndex == -1) || (targetIndex == -1))
		{
			console.log("Cannot remove field because we can't locate them in the scopes.");
			$scope.errorMessageDisplay = true;
			$scope.errorMessage = "Cannot remove field because of data structure mis-match.";
			return ;
		}
		
		$scope.currentPipeline.pipeline.fields.splice(targetIndex, 1);
		
		//go through each box
		angular.forEach($scope.crm, function(box, boxKey){
			//Remove the field from each box.
			box.fields.splice(targetFieldIndex, 1);
		});
		
		dataServices.save($scope.pipelines);
		$scope.deleteFieldConfirm = false;
	}
	
	$scope.cancelFieldDelete = function()
	{
		$scope.deleteFieldConfirm = false;
	}
	
	$scope.removeField = function(targetField)
	{
		
		
		$scope.deleteFieldConfirm = true;
		$scope.potentialField = targetField;
	}
	
	$scope.gotoStages = function()
	{
		dataServices.save($scope.pipelines);
		$location.path('/stages');
	}
	
	$scope.confirmFlowDelete = function()
	{
		var targetIndex = $scope.pipelines.indexOf($scope.potentialFlow);
		if (targetIndex != -1)
		{
			$scope.pipelines.splice(targetIndex, 1);
			
			$scope.selectedPipeline = $scope.pipelines[0];
			$scope.switchPipeline();
			
		}
		$scope.deleteFlowConfirm = false;
		dataServices.save($scope.pipelines);
	}
	
	$scope.cancelFlowDelete = function()
	{
		$scope.deleteFlowConfirm = false;
	}
	
	$scope.deleteFlow = function()
	{
		if ($scope.currentPipeline == $scope.selectedPipeline)
		{
			$scope.deleteFlowConfirm = true;
			$scope.potentialFlow = $scope.currentPipeline;
		}
	}
	
	$scope.save = function()
	{
		dataServices.save($scope.pipelines);
	}
	
	$scope.backupToDisk = function()
	{	
		try {
			var timeStamp = new Date().getTime();
			var targetFileName = "flow" + timeStamp.toString() + "backup.dat";
			targetFile = $scope.documentsDir.createFile(targetFileName);
			
			
			targetFile.openStream('w', $scope.writeFlowsToStream, null);
		} catch(exception) {
			console.log("can't resolve file " + exception.message);
		}
		
		$scope.backedupStatus = true;
		$scope.backupMessage = "Backed Up Successful. Saved in Documents Folder";
	}
	
	$scope.writeFlowsToStream = function(fileStream) 
	{
		fileStream.write(JSON.stringify($scope.pipelines));
		fileStream.close();	
	}
	
	//Init
	$scope.initDocumentsDirectory = function()
	{
		tizen.filesystem.resolve("documents", $scope.foundDocumentsDirectory, null, "rw");
	}
	
	$scope.foundDocumentsDirectory = function(dir)
	{
		$scope.documentsDir = dir;
	}
	
	$scope.initDocumentsDirectory();
	
}

function filePickerCtrl($scope,  dataServices, linkedContentServices)
{
	screen = 4;
	$scope.selectedStageId = dataServices.getCurrentStageId();
	$scope.pipelines = dataServices.load();	
	$scope.flow = $scope.pipelines[dataServices.getCurrentFlowIndex()];
	$scope.stages = $scope.flow.pipeline.stages;
	$scope.fields = $scope.flow.pipeline.fields;
	$scope.crm = $scope.flow.pipeline.crm;
	$scope.currentBoxId = dataServices.getCurrentBoxId();	
	
	$scope.targetContent = new Array();
	
	//	console.log("Trying to open box id" + $scope.currentBoxId);
	//Get the first (only one) - ideally should be a filter?
	$scope.client = _.where( $scope.crm, {id:$scope.currentBoxId})[0];
	
	if ($scope.client.linkedContent == null){
		$scope.client.linkedContent = new Array();
	}
	
	$scope.possibleContent = new Array();
	$scope.directoryListing = new Array();
	$scope.targetContentDirectory = new Object();
	$scope.targetContentDirectory.id = new Object();
	$scope.linkedContent = new Array();
	
	
	$scope.errorCallback = function(err)
	{
		console.log(err);
	}
	
	$scope.contentGetDirectorySuccess = function(directories)
	{	
		$scope.directoryListing = new Array();
		angular.forEach(directories, function(directory, key){
			
			if (directory != null){
				$scope.directoryListing.push(directory);
			}
		});		
		
		
		$scope.targetContentDirectory.id = $scope.directoryListing[0].id;
		$scope.openDirectory();
		$scope.$apply();
	}
	
	$scope.openDirectory = function()
	{
		contentManager.find($scope.contentArraySuccessCallback, null, $scope.targetContentDirectory.id);
	}
	
	$scope.contentArraySuccessCallback = function(contents)
	{
		$scope.possibleContent = new Array();
		angular.forEach(contents, function(contentEntry, key){
			
			$scope.possibleContent.push(contentEntry);
		});
		
		$scope.$apply();		
	}
	
	$scope.linkEntry = function(tContent)
	{	
		$scope.client.linkedContent.push(tContent);
		dataServices.save($scope.pipelines);
		
		$scope.goBack();
	}
	
	$scope.goBack = function()
	{
		window.location.href = "#/personview/"+previousBoxId;
	}
	
	if (($scope.directoryListing == null) || ($scope.directoryListing.length == 0))
	{
		//Call refresh of directory.
		contentManager.getDirectories($scope.contentGetDirectorySuccess, $scope.errorCallback);
	}
	
}