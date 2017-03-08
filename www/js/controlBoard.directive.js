'use strict';

app.directive('controlBoard', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/control-board.html',
    scope: {
      'gameplay' : '=',
      'select': '&',
      'cancel': '&'
    }
  }
});

app.directive('dynamicLayout', function(){
  return{
    restrict: 'A',
    scope: {
      'dloptions': '='
    },
    link: function(scope, element, attrs, controllers){
      var detLength = scope.dloptions.length;
      var len1 = scope.dloptions.breakpoints[0];
      var len2 = scope.dloptions.breakpoints[1];

      if(detLength <= len1){
        element.addClass('col-33');
      }
      else if(detLength <= len2 && detLength > len1){
        element.addClass('col-50');
      }
      else {
        element.addClass('col-100');
      }
    }
  }
});
