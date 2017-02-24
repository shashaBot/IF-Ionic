
app.directive('digiClock', function(){
  return {
    'restrict' : 'E',
    'templateUrl': 'templates/digi-clock.html',
    'scope': {
      'time': '='
    }
  }
});
