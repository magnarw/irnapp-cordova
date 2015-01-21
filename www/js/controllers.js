angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location) {
  // Form data for the login modal
  
  $scope.changeView = function(view){
            $location.path(view); // path not hash
  }
  $scope.navTitle = '<div class="icon-home"></div>';
})

.controller('HijiriCtrl', function($scope) {
  // Form data for the login modal
  
})

.controller('PlaylistsCtrl', function($scope) {
    
  $scope.currentPreyDateDisplayed =  moment(); 
  $scope.currentPreyDateDisplayed.hours(0);
  $scope.currentPreyDateDisplayed.seconds(0);
  $scope.currentPreyDateDisplayed.minutes(0);
  var today = moment();

  $scope.playlists = [
    { title: 'Fajr', time : "06:01", hasAlarm : false, id: 1, isActive : false ,isNext : false},
    { title: 'Soloppgang',time : "06:01", hasAlarm : false,id: 2, isActive : false,isNext : false},
    { title: 'Duhr', time : "06:01", hasAlarm : false,id: 3, isActive : false,isNext : false},
    { title: 'Duhr', time : "06:01", hasAlarm : false,id: 3, isActive : false,isNext : false},
    { title: 'Maghrib', time : "06:01", hasAlarm : false,id: 4, isActive : true,isNext : false},
    { title: 'Isha', time : "23:01", hasAlarm : false, id: 5, isActive : false,isNext : false},
  
  ];

  $scope.navTitle = '<div class="icon-home"></div>';

  $scope.isNext = function(id) {
     for(var i =0;i<$scope.playlists.length;i++){
      var prey = $scope.playlists[i];
      if(prey.IsActive == true && prey.Id == id ){
        return true; 
      }
    }
    return false;
  };

  var findActiveAndNextPrey = function () {
    var active = null; 
    var next = null; 
    today = moment();
    for(var i =0;i<$scope.playlists.length;i++){
      var prey = $scope.playlists[i];
      var date = _getDateFromPrey(prey);
      if(date.isAfter(today)){
        active = prey; 
        active.countDown = (date - today)/1000;
      
      }
    }
    if(active!==null){
      active.isNext = true; 
    }
  }

 
   var _getDateFromPrey = function(prey){
    var date = moment($scope.currentPreyDateDisplayed);
    var res = prey.time.split(":");
    date = date.hours(res[0]);
    date = date.minutes(res[1]);
    return date; 
  }


 


  $scope.nextDay = function() {
     $scope.currentPreyDateDisplayed = moment().add(1, 'days');
  };

  $scope.prevDay = function() {
     $scope.currentPreyDateDisplayed = moment().subtract(1, 'days');
  };

  findActiveAndNextPrey();


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
