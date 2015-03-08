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

.controller('QiblaCtrl', function($scope) {
  
  $scope.nav = {
      deg: 1
  }


  var succ = function(heading) {
    $scope.nav.deg = heading.magneticHeading;
    console.log("scope heading:" + $scope.nav.deg)
    $scope.$apply();
  };

  var err = function(error) {
   
  };

  var options = {
      frequency: 100
  }; // Update every 3 seconds

  navigator.compass.watchHeading(succ, err, options);



  
})
.controller('CalenderCtrl', function($scope,preyTimesService,$cordovaDatePicker) {
  
  $scope.navTitle = '<div class="icon-home"></div>';

  $scope.currentPreyDateDisplayed =  moment(); 
  var start = moment([$scope.currentPreyDateDisplayed.year(), $scope.currentPreyDateDisplayed.month()- 1]);

    // Clone the value before .endOf()
  var end = moment(start).endOf('month');

$scope.example = {
       value: new Date(2013, 9, 1)
     };

  $scope.days = preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear());

  $scope.activeIndex = $scope.currentPreyDateDisplayed.date();

  $scope.setActive = function(index){
    $scope.activeIndex = index +1; 


  }; 
$scope.showDatePicker = function () {
  var options = {
    date: new Date(),
    mode: 'date',
    minDate:  moment().subtract(100, 'years').toDate(),
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'Done',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'Abort',
    cancelButtonColor: '#000000'
  };
  

  $cordovaDatePicker.show(options).then(function(date){
     if(date != undefined){
        $scope.currentPreyDateDisplayed = moment(date);
         var start = moment([$scope.currentPreyDateDisplayed.year(), $scope.currentPreyDateDisplayed.month()- 1]);
    // Clone the value before .endOf()
        var end = moment(start).endOf('month');
        $scope.activeIndex = -1; 
        $scope.days = preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear());
     }
  
  });
  };

  $scope.nextDay = function(){
      $scope.currentPreyDateDisplayed.add(1, 'month');
       var start = moment([$scope.currentPreyDateDisplayed.year(), $scope.currentPreyDateDisplayed.month()- 1]);
    // Clone the value before .endOf()
        var end = moment(start).endOf('month');
        $scope.activeIndex = -1; 
        $scope.days = preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear());
  };

  $scope.prevDay = function(){
     $scope.currentPreyDateDisplayed.add(-1, 'month');
        var start = moment([$scope.currentPreyDateDisplayed.year(), $scope.currentPreyDateDisplayed.month()- 1]);
    // Clone the value before .endOf()
        var end = moment(start).endOf('month');
        $scope.activeIndex = -1; 
        $scope.days = preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear());
  };



   $scope.dateChanged = function(){
    alert("hei");
   };


  $scope.isCurrentDay = function(index){
    index = index +1; 
   
    if(index === $scope.activeIndex)
      return true; 
    else 
      return false;

  }; 

 

  

  
})
.controller('PlaylistsCtrl', function($scope,$ionicModal,preyTimesService,$localstorage) {
    
  $scope.currentPreyDateDisplayed =  moment(); 
  $scope.currentPreyDateDisplayed.hours(0);
  $scope.currentPreyDateDisplayed.seconds(0);
  $scope.currentPreyDateDisplayed.minutes(0);
  $scope.playlists = preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear());
  var today = moment();


 $ionicModal.fromTemplateUrl('templates/login.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
  }); 
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  var now = new Date().getTime();
  var _60_seconds_from_now = new Date(now + 60*1000);

  $scope.$on('onTrigger', function(event, id, state, json) {
    console.log('notification ADDED, id: ' + id  + ' state:' + state + ' json:' + json );
  });



  $scope.setAlarm = function(prey) {
      $scope.currentAlarm = prey;
      if($localstorage.hasValue(prey.title)){
        $localstorage.set(prey.title,false);
      }else {
        $scope.modal.show();
      
      }
      $scope.playlists = preyTimesService.getPreyTimesForDay(1);

  };

   $scope.addAlarm = function() {

      //Hvis klokken er mer enn alarm tid. Sett alarm for



      $localstorage.set($scope.currentAlarm.title,$scope.preyOffset);
      $scope.playlists = preyTimesService.getPreyTimesForDay(1);
      $scope.modal.hide();
  };
 

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

  //Hvis du er på preyitem og den starter før tiden og neste bønn starter i fremtiden


//Gå gjennom alle bønner
//Er start tid før dagens tid <- passed
//Er start tid før dagens bønn og neste bønn ikke har startet/eller det finnes ikke flere  <- active


/*
  var isActive = function(){
 
    var date = 
    for(var i =0;i<$scope.playlists.length;i++){
       var prey = $scope.playlists[i];

      var date = _getDateFromPrey(prey);
      if(date.isAfter(today)){
        active.countDown = (date - today)/1000;
        if()
              
      }
      
    };


  };
  */

  /*
        private boolean isActive(PreyItem preyItem) {
    List<PreyItem> candidates = new ArrayList<PreyItem>();
    if (!preyItem.getTime().isBeforeNow())
      return false;
    for (PreyItem candiate : preyTimes) {
      if (candiate.getTime().isBeforeNow()) {
        candidates.add(candiate);
      }
    }
    Collections.sort(candidates);
    return candidates.get(candidates.size() - 1).equals(preyItem)
        && (preyItem.getTime().getDayOfMonth() == DateTime.now()
            .getDayOfMonth() && preyItem.getTime().getMonthOfYear() == DateTime
            .now().getMonthOfYear());
  }

  private boolean isNext(PreyItem preyItem) {
    if (!preyItem.getTime().isAfterNow())
      return false;
    if (preyItem.getTime().getDayOfYear() == currentDate.getDayOfYear()) {
      List<PreyItem> candidates = new ArrayList<PreyItem>();
      for (PreyItem candiate : preyTimes) {
        if (candiate.getTime().isAfterNow()) {
          candidates.add(candiate);
        }
      }
      Collections.sort(candidates);
      return candidates.get(0).equals(preyItem);
    } else {
      return false;
    }
  }
  
  */



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
     $scope.currentPreyDateDisplayed = $scope.currentPreyDateDisplayed.add(1, 'days');
     $scope.playlists = preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear());
      findActiveAndNextPrey();
  };

  $scope.prevDay = function() {
     $scope.currentPreyDateDisplayed = $scope.currentPreyDateDisplayed.subtract(1, 'days');
     $scope.playlists = preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear());
      findActiveAndNextPrey();
  };

  findActiveAndNextPrey();


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
