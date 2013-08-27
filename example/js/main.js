angular.module('EditorExample', ['Editor']);

angular.module('EditorExample').controller('CoreController', function($scope, $http){
  $scope.test = {
    objects_array: [
      {a:1, b:2},
      {a:1, b:2}
    ]
  };

  $scope.update = function(){
    $http.get('/js/config.json').success(function(json){
      $scope.test = json;
    });
  };
});
