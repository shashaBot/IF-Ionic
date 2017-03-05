'use strict';

app.directive('controlBoard', function(){
  return {
    'restrict': 'E',
    'templateUrl': 'templates/control-board.html',
    'scope': {
      'gameplay' : '=',
      'execute': '&'
    }
  }
})
