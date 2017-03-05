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
  }
  initGame();
  var text = {};
  var savedGameId;
  var savedGameObj;

  function initControls(){
    game.controls = [];
    for (var control in game.play.CONT){
      game.controls.push(control);
    }
    game.directions = [];
    for (var direction in game.play.DIRT){
      game.directions.push(direction);
    }
    game.objects = [];
    for (var object in game.play.IOBJ){
      game.objects.push(object);
    }
  }

  game.controlBoardVisible = false;

  game.showControlBoard = function (){
    game.controlBoardVisible = !game.controlBoardVisible;
    console.log("control-board::", game.controlBoardVisible);
  }

  game.TEST = [{text: '1', command: 'balh1'},
              {text: '2', command: 'balh2'},
              {text: '3', command: 'balh3'},
              {text: '4', command: 'balh4'},
              {text: '5', command: 'balh5'},
              {text: '6', command: 'balh6'},
              {text: '7', command: 'balh7'}
            ];

  game.execute = function(command) {
    console.log("You tapped command::", command);
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
    } else {
      if(game.input === 'save' || game.input === 'restore' || game.input === 'restart'){
        text = {
          author: "game",
          msg: "Only if it could be that simple!"
        };
        game.texts.push(text);
        text = {};
      }
      else if (game.input === 'look' || input === 'look'){
        //show something or not, you decide.
        text = {
          author: "game",
          msg: "Yeah, yeah I'm looking or at least trying to."
        };
        game.texts.push(text);
        text = {};
      }
      else{
        $quixe.readline_resume(input);
      }
    }
    if(game.input){
      text = {
        author: "player",
        msg: game.input
      };
      game.texts.push(text);
      text = {};
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
