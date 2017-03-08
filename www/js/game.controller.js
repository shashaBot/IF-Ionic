'use strict';

app.controller('gameCtrl', function(gameSrc, $quixe, $ionicScrollDelegate, $q, $ionicPopup, $scope){
  var game = this;
  game.readkey = false;
  game.src = gameSrc;
  game.started = false;
  function initGame(){
    game.input = '';
    game.play = {};
    game.texts = [];
    game.controlBoardVisible = false;
  }
  initGame();
  var text = {};
  var savedGameId;
  var savedGameObj;

  function initControls(){
    game.commands = JSON.parse(game.play.COMM).commands;
    game.directions = JSON.parse(game.play.DIRT).directions;
    game.objects = JSON.parse(game.play.IOBJ).objects;
    game.persons = JSON.parse(game.play.IOBJ).persons;
    game.subjects = JSON.parse(game.play.IOBJ).subjects;

    game.controls = game.commands;

    executionText = '';
    commandVars = 0;
    varNo = 0;
    selectedCommand = {};
  }

  game.showControlBoard = function (){
    game.controlBoardVisible = !game.controlBoardVisible;
    console.log("control-board::", game.controlBoardVisible);
  };

  game.cancelControl = function(){
    if(game.controls === game.commands){
      game.controlBoardVisible = false;
    }
    else {
      initControls();
    }
  }

  var executionText = '';
  var commandVars = 0;
  var varNo = 0;
  var selectedCommand = {};


  game.selectControl = function(selected){
    console.log(game.controls);
    if(game.controls === game.commands){
      selectedCommand = selected;
      executionText = selectedCommand.execution;
      if(selectedCommand.variables.length){
        commandVars = selectedCommand.variables.length;
        varNo++;
        selectVariable(selectedCommand, varNo);
      }
      else {
        game.send(executionText);
      }
    }
    else {
      //replace the selected ka text with var(varNo) in executionText.
      executionText = executionText.replace("var"+varNo, selected.text);
      commandVars--;
      console.log(commandVars);
      if(!commandVars){
        game.send(executionText);
      }
      else {
        varNo++;
        selectVariable(selectedCommand, varNo);
      }
    }
  }

  var selectVariable = function(command, i){
    switch (command.variables[i-1]) {
      case "object":
        game.controls = game.objects;
        //the selection of var varNo is going on
        break;
      case "person":
        game.controls = game.persons;
        break;
      case "direction":
        game.controls = game.directions;
        break;
      case "subject":
        game.controls = game.subjects;
        break;
      default:
        // no match for the type of variable sent in command

    }
  }

  game.showSettings = function() {
    var settingsPopup = $ionicPopup.show({
      templateUrl: 'templates/settingsPopup.html',
      title: '<b>Settings</b>',
      scope: $scope,
      buttons: [
        {
      		text: '<i class="icon ion-ios-close"></i>',
      		type:'popclose',
      		onTap: function(e) {
            return 'close it already';
      		}
	      }
      ]
    });
    settingsPopup.then(function(res) {
      console.log(res);
    });
  }

  $scope.loadSavedGame = function() {
    if(!savedGameId){
      savedGameId = game.gameInfo.serialNumber;
    }
    $quixe.restore_state(JSON.parse(window.localStorage.getItem(savedGameId+": savedPrgrs")));
    game.send('sendingSthBecauseQuixeExpectSth');
    //remove [blah blah] from main channel
    //show notification of game loaded successfully
    console.log("Game restore: ", game.play);
  };

  game.send = function(input){
    input = input || game.input;
    if (this.readkey) {
      $quixe.readkey_resume(input.charCodeAt(0));
    }
    if(input && (input !== 'save' || input !== 'restore' || input !== 'restart')){
      text = {
        author: "player",
        msg: input
      };
      game.texts.push(text);
      text = {};
      $quixe.readline_resume(input);
    }
    game.readkey = false;
    $ionicScrollDelegate.$getByHandle('gameplay-page').scrollBottom(true);
    game.input = '';
  };

  $scope.saveProgress = function() {
    game.send('save');
  };

  $quixe.on('ready', function(data) {
    console.log('ready', data);
    var oldLocation = game.play.LOCN;
    game.play = data;
    //game.gameInfo has not been defined and game.play.INFO has been received, the define game.gameInfo
    if(!game.gameInfo && game.play.INFO){
      game.gameInfo = JSON.parse(game.play.INFO);
      savedGameId = game.gameInfo.serialNumber;
      console.log(game.gameInfo);
    }
    if(game.play.MAIN !== "[stopped: success]\n"){
      text = {
        author: "game",
        msg: game.play.MAIN
      };
      game.texts.push(text);
    }
    text = {};
    initControls();
    console.log('ready controls', game.controls);
    console.log("game.text::", game.texts);
    $ionicScrollDelegate.$getByHandle('gameplay-page').scrollBottom(true);
  });

  $quixe.on('save', function(){
    window.localStorage.setItem(savedGameId+": savedPrgrs", JSON.stringify($quixe.get_state()));
    savedGameObj = JSON.parse(window.localStorage.getItem(savedGameId+": savedPrgrs"));
    console.log("game progress saved: ", savedGameObj);
    //show notification of game saved
  });

  $quixe.on('load', function(){
    savedGameObj = JSON.parse(window.localStorage.getItem(savedGameId+": savedPrgrs"));
    if(!savedGameObj){
      return;
    }
    $quixe.restore_state(savedGameObj);
    console.log("game progress restored: ", savedGameObj);
  });

  $quixe.on('snapshot', function(data) {
    console.log('snapshot', data);
  });
  $quixe.on('fatal_error', function(error) {
    console.log('fatal_error', error);
  });

  $quixe.on('readkey', function() {
    game.readkey = true;
    console.log('readkey');
  });
});
