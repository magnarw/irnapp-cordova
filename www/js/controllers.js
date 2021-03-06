angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicHistory, $ionicModal, $timeout,$location,$localstorage,$ionicSideMenuDelegate,$rootScope,$state) {
  // Form data for the login modal
  
  $scope.changeView = function(view){
    if($localstorage.hasValue("watchid")) {
  navigator.compass.clearWatch($localstorage.get("watchid"));


} 

  
$localstorage.set("watchid", "false");
    $ionicSideMenuDelegate.toggleLeft(false);
    console.log('This is the view:' + view);
            $state.go(view);
            //$location.path(view); // path not hash
  }
  

  $scope.differentTapTitle = function(){
  

    $scope.changeView('app.playlists');
      $rootScope.$broadcast('homebuttonclicked', {
      someProp: 'Sending you an Object!' // send whatever you want
    });

  }
})

.controller('HijiriCtrl', function($scope,$sce) {

  $scope.url = $sce.trustAsResourceUrl('http://www.irn.no');

  $scope.config = {}; // use defaults
$scope.model = {}; // always pass empty object
  
  console.log('ddf');

  $scope.tapped = function($event) {
  console.log("dfdf");
  var ele = $event.target;
  var x = Math.floor(Math.random() * 200) + 1,
      y = Math.floor(Math.random() * 100) + 1,
      z = Math.floor(Math.random() * 6) + 1,
      rot = Math.floor(Math.random()*360)+1;
  $(ele).css({
    'transform': 
      "translate3d("+x+"px,"+y+"px,"+z+"px)" +
      "rotate("+rot+"deg)"
  });
}
  
})

.controller('QiblaCtrl', function($scope,$localstorage,$rootScope) {
  $scope.nav = {
      deg: 1
  }
  var enter = true; 
  var watchID = null; 
  var succ = function(heading) {
    console.log("Postion:" + heading.magneticHeading);
    $scope.nav.deg = - heading.magneticHeading;
   
    $scope.$apply();
  };
  var err = function(error) {
   console.log("Error:" + error.code);
  };
  //var watchId = navigator.geolocation.watchPosition(succ,err,{ maximumAge: 30000, timeout: 50000, enableHighAccuracy: false });
var options = {
    frequency: 30
}; // Update every 3 seconds
  
if($localstorage.hasValue("watchid")) {
  navigator.compass.clearWatch($localstorage.get("watchid"));
} 
    
      

watchID = navigator.compass.watchHeading(succ, err, options);
$localstorage.set("watchid", watchID);

enter = false; 
 
  
  






  
})
.controller('CalenderCtrl', function($scope,preyTimesService,$cordovaDatePicker,$localstorage,$rootScope) {


  
  $scope.navTitle = '<div class="icon-home"></div>';

  $scope.currentPreyDateDisplayed =  moment(); 
  var start =  moment($scope.currentPreyDateDisplayed).startOf('month');
    // Clone the value before .endOf()
  var end  =moment($scope.currentPreyDateDisplayed).endOf('month');

$scope.example = {
       value: new Date(2013, 9, 1)
     };

  preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear(), function(data){ $scope.days = data});

  $scope.activeIndex = $scope.currentPreyDateDisplayed.date()-1;

  $scope.setActive = function(index){
    $scope.activeIndex = index; 


  }; 

 $rootScope.$on('homebuttonclicked', function (event, data) {
 
$scope.currentPreyDateDisplayed =  moment(); 
  var start =  moment($scope.currentPreyDateDisplayed).startOf('month');
    // Clone the value before .endOf()
  var end  =moment($scope.currentPreyDateDisplayed).endOf('month');

$scope.example = {
       value: new Date(2013, 9, 1)
     };

  preyTimesService.getPreyTimesForMonth(start.dayOfYear(),end.dayOfYear(), function(data){ $scope.days = data});

  $scope.activeIndex = $scope.currentPreyDateDisplayed.date()-1;
});


$scope.showDatePicker = function () {
  var options = {
    date: new Date(),
    mode: 'date',
    minDate:  moment().subtract(100, 'years').toDate(),
    allowOldDates: true,
    allowFutureDates: true,
     locale: "NO",
    doneButtonLabel: 'Velg måned',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'Avbryt',
    cancelButtonColor: '#000000'
  };
  

  $cordovaDatePicker.show(options).then(function(date){
     if(date != undefined){
        $scope.currentPreyDateDisplayed = moment(date);
        var localStart = moment($scope.currentPreyDateDisplayed).startOf('month');
    // Clone the value before .endOf()
        var localEnd = moment($scope.currentPreyDateDisplayed).endOf('month');
        $scope.activeIndex = -1; 
        preyTimesService.getPreyTimesForMonth(localStart.dayOfYear(),localEnd.dayOfYear(), function(data){ $scope.days = data});
     }
  
  });
  };

  $scope.nextDay = function(){
      $scope.currentPreyDateDisplayed = $scope.currentPreyDateDisplayed.add(1, 'month');
         var localStart =  moment($scope.currentPreyDateDisplayed).startOf('month');
    // Clone the value before .endOf()
        var localEnd  =moment($scope.currentPreyDateDisplayed).endOf('month');
        $scope.activeIndex = -1; 
        preyTimesService.getPreyTimesForMonth(localStart.dayOfYear(),localEnd.dayOfYear(), function(data){ $scope.days = data});
  };

  $scope.prevDay = function(){
     $scope.currentPreyDateDisplayed = $scope.currentPreyDateDisplayed.add(-1, 'month');
         var localStart =  moment($scope.currentPreyDateDisplayed).startOf('month');
    // Clone the value before .endOf()
        var localEnd  =moment($scope.currentPreyDateDisplayed).endOf('month');
        $scope.activeIndex = -1; 
        preyTimesService.getPreyTimesForMonth(localStart.dayOfYear(),localEnd.dayOfYear(), function(data){ $scope.days = data});
  };





  $scope.isCurrentDay = function(index){
    index = index +1; 
   
    if(index === $scope.activeIndex)
      return true; 
    else 
      return false;

  }; 

 

  

  
})
.controller('PlaylistsCtrl', function($ionicPlatform, $ionicPlatform, $log, $scope,$ionicModal,preyTimesService,$localstorage,$cordovaDatePicker,alarmService, $cordovaToast,$rootScope) {

  
  $scope.preyOffset = 5;

 

  var findActiveAndNextPrey = function (data) {
    $scope.playlists = data;
    var active = findActive(); 
    if(active != null){
      active.isActive = true; 
    }
    var next = findNext(); 
    if(next != null){
      var date = _getDateFromPrey(next);
      next.countDown = (date - today)/1000;
      next.isNext = true; 
    }


  }
  var i = 0; 

  $rootScope.$on('resume-mode', function (event, data) {
 
  i++;
  $scope.currentPreyDateDisplayed =  moment(); 
  $scope.currentPreyDateDisplayed.hours(0);
  $scope.currentPreyDateDisplayed.seconds(0);
  $scope.currentPreyDateDisplayed.minutes(0);
  preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
   today = moment();
});

  $rootScope.$on('homebuttonclicked', function (event, data) {
 
  i++;
  $scope.currentPreyDateDisplayed =  moment(); 
  $scope.currentPreyDateDisplayed.hours(0);
  $scope.currentPreyDateDisplayed.seconds(0);
  $scope.currentPreyDateDisplayed.minutes(0);
  preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
   today = moment();
});







  
  $scope.currentPreyDateDisplayed =  moment(); 
  $scope.currentPreyDateDisplayed.hours(0);
  $scope.currentPreyDateDisplayed.seconds(0);
  $scope.currentPreyDateDisplayed.minutes(0);
  preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
  var today = moment();

  
  /* 

  var GetPreyDateHeader = function() {
    
    var dayOfWeek = $scope.currentPreyDateDisplayed.dayOfWeek()
    var day = ""; 
   if(dayOfWeek == 1)
      day = "Mandag";
   else if(dayOfWeek == 2)
      day = "Tirsdag";
   else if(dayOfWeek == 3)
      day = "Onsdag";
   else if(dayOfWeek == 4)
      day = "Torsdag";
   else if(dayOfWeek == 5)
      day = "Fredag";
   else if(dayOfWeek == 6)
      day = "Lørdag";
   else if(dayOfWeek == 7)
      day = "Søndag";
   else 
      day = "Ukjent";

    day = day + " " + $scope.currentPreyDateDisplayed.dayOfMonth() + "." + $scope.currentPreyDateDisplayed.monthOfYear() + "." + $scope.currentPreyDateDisplayed.Year(); 
    
    $scope.preyDateHeader  = day; 
  }
   

  GetPreyDateHeader();
  */

  /*
  private void setUpCurrentDay() {
    int dayOfWeek = timeCurrentlyUsedInPreyOverView.getDayOfWeek();
    String day;
    switch (dayOfWeek) {
    case 1:
      day = "Mandag";
      break;
    case 2:
      day = "Tirsdag";
      break;
    case 3:
      day = "Onsdag";
      break;
    case 4:
      day = "Torsdag";
      break;
    case 5:
      day = "Fredag";
      break;
    case 6:
      day = "Lørdag";
      break;
    case 7:
      day = "Søndag";
      break;
    default:
      day = "Ukjent";
      break;

    }
    day += " " + timeCurrentlyUsedInPreyOverView.getDayOfMonth() + "."
        + timeCurrentlyUsedInPreyOverView.getMonthOfYear() + "."
        + timeCurrentlyUsedInPreyOverView.getYear();
    currentDay.setText(day);
  }


  */


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

  $scope.showDatePicker = function () {
  var options = {
    date: new Date(),
    mode: 'date',
    minDate:  moment().subtract(100, 'years').toDate(),
    allowOldDates: true,
    allowFutureDates: true,
    locale: "NO",
    doneButtonLabel: 'Velg dag',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'Avbryt',
    cancelButtonColor: '#000000'
  };
  

  $cordovaDatePicker.show(options).then(function(date){
     if(date != undefined){
        $scope.currentPreyDateDisplayed = moment(date);
        preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
        
     }
  
  });
  };


  $scope.ShowAlarmDatePicker= function (prey) {
  var options = {
    date: _getDateFromPrey(prey).toDate(),
    mode: 'time',
    minDate:  moment().subtract(100, 'years').toDate(),
    allowOldDates: true,
    allowFutureDates: true,
     locale: "NO",
    doneButtonLabel: 'Sett alarm',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'Avbryt',
    cancelButtonColor: '#000000'
  };

  $scope.currentAlarm = prey;
      if($localstorage.hasValue(prey.title)){
        alarmService.cancelAlarm(prey.title);
 $cordovaToast.showLongBottom('Alarm er deaktivert!').then(function(success) {
    // success
            }, function (error) {
              // error
            });
        preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
      }else {
        
        $cordovaDatePicker.show(options).then(function(date){
         if(date != undefined){
            var diffMs = _getDateFromPrey(prey).toDate()-date;
            var preyOffset = Math.round(diffMs / 60000);
            alarmService.setAlarm($scope.currentAlarm.title,preyOffset);

          //  $localstorage.set($scope.currentAlarm.title,$scope.preyOffset);
            preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);

            if(preyOffset>0){
              $cordovaToast.showLongBottom('Alarm er satt for ' + prey.title + '. Den vil gå av ' + preyOffset + ' minutter før bønnetid hver dag.').then(function(success) {
    // success
            }, function (error) {
              // error
            });
         }else {
                $cordovaToast.showLongBottom('Alarm er satt for ' + prey.title + '. Den vil gå av ' + (preyOffset*-1) + ' minutter etter bønnetid hver dag.').then(function(success) {
    // success
            }, function (error) {
              // error
            });

         }
            }
      
      });
  };

};


  $scope.setAlarm = function(prey) {
      $scope.currentAlarm = prey;
      if($localstorage.hasValue(prey.title)){
        alarmService.cancelAlarm(prey.title);
            console.log("cancel");
             $cordovaToast.showLongBottom('Alarm er deaktivert.').then(function(success) {
    // success
            }, function (error) {
              // error
            });

      }else {
        $scope.modal.show();
      
      }
        preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);

  };

   $scope.addAlarm = function(preyOffset) {

      //Hvis klokken er mer enn alarm tid. Sett alarm for

      alarmService.setAlarm($scope.currentAlarm.title,preyOffset);

    //  $localstorage.set($scope.currentAlarm.title,$scope.preyOffset);
      preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
      $scope.modal.hide();
  };

   $scope.closeAlarm = function() {
      $scope.modal.hide();
  };
 

  $scope.navTitle = '<div class="icon-home" ng-click="differentTapTitle()"></div>';

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



  var findActive = function() {
    var active = null;
    for(var i =0;i<$scope.playlists.length;i++){
      var prey = $scope.playlists[i];
      var date = _getDateFromPrey(prey);
      if(date.isBefore(today)){
        
        prey.passed = true;

        if(moment().isSame(date, 'day')){
          active = prey; 
        }
      }
    }
    if(active!=null){
      active.passed = false; 
    }
    return active; 
  }

   var findNext = function() {
  
    for(var i =0;i<$scope.playlists.length;i++){
      var prey = $scope.playlists[i];
      var date = _getDateFromPrey(prey);
      if(date.isAfter(today) && today.isSame(date, 'day')){
        return prey;
      }
    }
    
  }


  var findActiveAndNextPrey = function (data) {
    $scope.playlists = data;
    var active = findActive(); 
    if(active != null){
      active.isActive = true; 
    }
    var next = findNext(); 
    if(next != null){
      var date = _getDateFromPrey(next);
      next.countDown = (date - today)/1000;
      next.isNext = true; 
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
    preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
      
  };

  $scope.prevDay = function() {
     $scope.currentPreyDateDisplayed = $scope.currentPreyDateDisplayed.subtract(1, 'days');
     $scope.playlists = preyTimesService.getPreyTimesForDay($scope.currentPreyDateDisplayed.dayOfYear(),findActiveAndNextPrey);
      
  };

  


})

.controller('AboutController', function($scope, $stateParams,$localstorage,$cordovaEmailComposer) {
  $scope.navTitle = '<div class="icon-home" ng-click="differentTapTitle()"></div>';
  $scope.openEpostClient = function(){
      $cordovaEmailComposer.open(email).then(null, function () {
   // user cancelled email
 });

  };

  var email = {
    to: 'post@irn.no',
    isHtml: true
  };

}).controller('SettingsController', function($scope,$localstorage,$cordovaToast) {

 
 $scope.navTitle = '<div class="icon-home" ng-click="differentTapTitle()"></div>';

  

  //$scope.city = null; 
  /*
  $scope.skygge1 = false;
  $scope.skygge2 = false; 
  $scope.isDisabledBy = true;
  $scope.isDisabledStandard = true;
  */
  var functionRenderSettings = function(){
     if($localstorage.hasValue("settings")){
        $scope.settings = $localstorage.getObject('settings');
     }else {
      $scope.settings = { 'calendarBasic' : true, 'calenderCity': false ,'city' : 'Oslo','skygge1': false, 'skygge2' : true, 'skygge1by': false, 'skygge2by' : false};
     }
  }


  
 

    $scope.$watch('settings.city', function(newVal,oldVal) {

      if(newVal != oldVal){

      
      $cordovaToast.showLongBottom(newVal +  ' er valgt').then(function(success) {
    // success
            }, function (error) {
              // error
        });
    }

      $localstorage.setObject('settings',  $scope.settings);
   },true);

      $scope.$watch('settings.calendarCity', function(newVal,oldVal) {

         if(newVal == true) {

              if(newVal != oldVal && newVal !=null){
      $cordovaToast.showLongBottom($scope.settings.city +  ' er valgt').then(function(success) {
    // success
            }, function (error) {
              // error
        });
       }

            $scope.settings.calendarBasic = false; 
            $scope.settings.calendarCity = true; 
            $scope.settings.skygge1 = false; 
            $scope.settings.skygge2 = false; 
            $scope.settings.skygge2by = true;
       //     $scope.settings.skygge1by = false;

         };
         if(newVal == false &&  $scope.settings.calendarBasic == false)
             $scope.settings.skygge2 = true; 


        $localstorage.setObject('settings',  $scope.settings);
   },true);

   $scope.$watch('settings.skygge1', function(newVal,oldVal) {

      if(newVal == true){

                     if(newVal != oldVal){
      $cordovaToast.showLongBottom('IRN standard Shafi er valgt').then(function(success) {
    // success
            }, function (error) {
              // error
        });
       }


        $scope.settings.calendarBasic = true; 
        $scope.settings.calendarCity = false; 
        $scope.settings.skygge2 = false; 
        $scope.settings.skygge1 = true; 
        $scope.settings.skygge1by = false;  
        $scope.settings.skygge2by = false;  
        

      }
      if(newVal == false){
        if(!$scope.settings.calendarCity)
          $scope.settings.skygge2 = true; 
      }

      $localstorage.setObject('settings',  $scope.settings);
   },true);

    $scope.$watch('settings.skygge2', function(newVal,oldVal) {
      if(newVal == true){

                         if(newVal != oldVal){
      $cordovaToast.showLongBottom('IRN standard Hanafi er valgt').then(function(success) {
    // success
            }, function (error) {
              // error
        });
       }

        $scope.settings.calendarBasic = true; 
        $scope.settings.calendarCity = false; 
        $scope.settings.skygge1 = false;
        $scope.settings.skygge2 = true; 
        $scope.settings.skygge1by = false;  
        $scope.settings.skygge2by = false;  
       

      }
      if(newVal == false){
         if(!$scope.settings.calendarCity)
          $scope.settings.skygge1 = true; 
      }

      $localstorage.setObject('settings',  $scope.settings);
   },true);


   $scope.$watch('settings.skygge1by', function(newVal,oldVal) {
     

      if(newVal == true){
        $scope.settings.skygge2by = false;  
        $scope.settings.skygge1by = true;  
        $scope.settings.calendarBasic = false;
        $scope.settings.skygge1 = false; 
        $scope.settings.skygge2 = false; 
        $scope.settings.calendarCity = true; 
      }
      console.log("skygge1:" + newVal);

      if(newVal == false && $scope.settings.calendarCity){
          $scope.settings.skygge2by = true;  
      }

      $localstorage.setObject('settings',  $scope.settings);

   },true);

    $scope.$watch('settings.skygge2by', function(newVal,oldVal) {
      

      if(newVal == true){
        $scope.settings.skygge2by = true;  
        $scope.settings.skygge1by = false;  
        $scope.settings.calendarBasic = false;
        $scope.settings.skygge1 = false; 
        $scope.settings.skygge2 = false; 
        $scope.settings.calendarCity = true; 
      }
      console.log("skygge2:" + newVal);

      if(newVal == false && $scope.settings.calendarCity){
          $scope.settings.skygge1by = true;  
      }

      $localstorage.setObject('settings',  $scope.settings);

   },true);

  functionRenderSettings();

  
});
