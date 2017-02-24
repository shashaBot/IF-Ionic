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
  //when player clicks on start after prologue is printed, the game sets turn count back to 0
  //we remove all the mixed data received and then start the game play with player looking in the room
  //turn count climbs back to 1.
  // game.startPlay = function(){
  //   game.started = true;
  //   console.log("game started::", game.started); //now the game has started, so the prologue is removed and first room's description is to be printed.
  // };

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
