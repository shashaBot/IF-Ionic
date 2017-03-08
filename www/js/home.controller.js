'use strict';

app.controller("homeCtrl", function($rootScope, $state){
    var home = this;
    $rootScope.src = "";
    $rootScope.gameLoading = false;
    home.loadGame = function(){
      $rootScope.gameLoading = true;
      if(ionic.Platform.isAndroid()){
        $rootScope.src="/android_asset/www/stories/newStory.json";
      }
      else {
        $rootScope.src = '../stories/newStory.json';
      }
      console.log("loading game");
      $state.go('game');
    };
});
