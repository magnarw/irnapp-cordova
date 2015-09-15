// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var app = angular.module('starter', ['ionic', 'starter.controllers','panzoom','starter.services','starter.directives','timer','angular-datepicker','angular-gestures','ngCordova'])

.run(function($ionicPlatform,$cordovaToast,$rootScope,alarmService,$ionicPopup,$localstorage) {

 

 var globalClose = false; 

  $ionicPlatform.ready(function() {





    $rootScope.$on("$locationChangeStart", function(event){
    if($localstorage.get('watchid') != undefined){
    navigator.compass.clearWatch($localstorage.get('watchid'));
  }
  });
  $rootScope.$on("$locationChangeSuccess", function(event){
     $rootScope.$broadcast('resume-mode', {
      someProp: 'Sending you an Object!' // send whatever you want
    });
  
  });







document.addEventListener("resume", function(){
    

       $rootScope.$broadcast('resume-mode', {
      someProp: 'Sending you an Object!' // send whatever you want
    });

 cordova.plugins.notification.local.on("click", function (notification) {
       
        

      var name = alarmService.getAlarmIdFromName(notification.id);
      alarmService.reschuldeAlarm(name);
        if(globalClose == false){
             globalClose = true; 

            var alertPopup = $ionicPopup.alert({
             title: 'Tid for bønn!',
             template: 'Det er tid for ' + name
           });

        }
      
       alertPopup.then(function(res) {
        globalClose = false; 
         console.log('Thank you for not eating my delicious ice cream cone');
       });


    });



           // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    cordova.plugins.notification.local.on("trigger", function (notification) {
        
         var name = alarmService.getAlarmIdFromName(notification.id);
         if(globalClose == false){
             globalClose = true; 

            var alertPopup = $ionicPopup.alert({
             title: 'Tid for bønn!',
             template: 'Det er tid for ' + name
           });

        }
       alertPopup.then(function(res) {
        globalClose = false; 
         console.log('Thank you for not eating my delicious ice cream cone');
       });

       
        alarmService.reschuldeAlarm(name);
        
        

        
    });

       
   
}, false);


   


 
  

  });


 




})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,hammerDefaultOptsProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider.state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.hijri', {
    url: "/hijiri",
     views: {
        'menuContent': {
          templateUrl: "templates/hijiri.html",
          controller: 'HijiriCtrl'
        }
      }
  })


  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
  .state('app.qibla', {
    url: "/qibla",
    views: {
      'menuContent': {
        templateUrl: "templates/qibla.html",
        controller: 'QiblaCtrl'
      }
    }
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsController'
      }
    }
  })
  .state('app.aboutirn', {
    url: "/aboutirn",
    views: {
      'menuContent': {
        templateUrl: "templates/aboutirn.html",
         controller: 'AboutController'
      }
    }
  }).state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    }).state('app.calender', {
      url: "/calender",
      views: {
        'menuContent': {
          templateUrl: "templates/calender.html",
          controller: 'CalenderCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
  $ionicConfigProvider.views.transition('none');

     hammerDefaultOptsProvider.set({
        recognizers: [
          [Hammer.Tap,{ event: 'tap'}],
          [Hammer.Tap, { event: 'doubletap', taps: 2 }, [], ['tap']],
         
          
        ]
    });
});


app.onReminderAdd = function(id, state, json) {
  $timeout(function() {
    $rootScope.$broadcast('onReminderAdd', id, state, json);
  }, 100);
};



