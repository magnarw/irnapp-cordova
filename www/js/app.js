// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var app = angular.module('starter', ['ionic', 'starter.controllers','starter.services','starter.directives','timer','angular-datepicker','angular-gestures','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


cordova.plugins.notification.local.registerPermission(function (granted) {
    // console.log('Permission has been granted: ' + granted);
});
  
  console.log(navigator.compass);
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


window.plugin.notification.local.ontrigger = function(id, state, json) {
  $timeout(function() {
    console.log('triggered');
    $rootScope.$broadcast('onTrigger', id, state, json);
  }, 100);
};



 
  

  });


 




})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,hammerDefaultOptsProvider) {
  $stateProvider

  .state('app', {
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
        templateUrl: "templates/aboutirn.html"
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



