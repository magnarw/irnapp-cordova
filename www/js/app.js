// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function($provide) {
  'use strict';

  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }

    return $delegate;

    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }

    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;

      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }

        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };

      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);

      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }

      return browser;
    }
  }]);
}]);

var app = angular.module('starter', ['ionic', 'starter.controllers','panzoom','starter.services','starter.directives','timer','angular-datepicker','angular-gestures','ngCordova','ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform,$cordovaToast,$rootScope,alarmService,$ionicPopup,$localstorage) {



 var globalClose = false; 

 window.ionic.Platform.ready(function() {






  

cordova.plugins.notification.local.hasPermission(function(granted) {
  if (!granted)
    cordova.plugins.notification.local.promptForPermission();
});




cordova.plugins.notification.local.on("trigger", function(notification) {

  console.log("alarm triggered");
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







document.addEventListener("resume", function(){
    

       $rootScope.$broadcast('resume-mode', {
      someProp: 'Sending you an Object!' // send whatever you want
    });

 alarmService.rescheduleAllAcitveAlarms();
/*
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
*/


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

    
});


app.onReminderAdd = function(id, state, json) {
  $timeout(function() {
    $rootScope.$broadcast('onReminderAdd', id, state, json);
  }, 100);
};



