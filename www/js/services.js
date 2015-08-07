angular.module('starter.services', [])


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    hasValue: function(key) {
      var value = $window.localStorage[key];
      if(value === undefined  || value === "false"){
        return false; 
      }else {
        return true; 
      }

    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]).service('preyTimesService', function($localstorage,$http){



    var currentDay = 1; 

    var setCurrentPreyCalender = function() {
        $http.get('preytimes/halden.json').success(function(data) {
            var prey = data[day];
        });
    };



    
    this.getPreyTimesForDay = function(day,renderCallBack){

       var settings = $localstorage.getObject('settings');
       var city = "Oslo";
       var skygge2 = true;
       if(settings!=null && settings.city != null){
           city = settings.city;
       }
       $http.get('preytimes/'+city+'.js').success(function(data) {
          
            if(settings!=null){
            if(settings.city!=null){
                skygge2 = settings.skygge2by;
            }else {
                skygge2 = settings.skygge2;
            } 
            }
            var prey = data[day-1];



            var preyForDay = [
                { title: 'Fajr', time :cleanTime(prey.Fajr), hasAlarm :$localstorage.hasValue("Fajr"), id: 1, isActive : false ,isNext : false},
                { title: 'Soloppgang',time :cleanTime(prey.Soloppgang), hasAlarm : $localstorage.hasValue("Soloppgang"),id: 2, isActive : false,isNext : false},
                { title: 'Dhuhr', time : cleanTime(prey.Duhr), hasAlarm : $localstorage.hasValue("Dhuhr"),id: 3, isActive : false,isNext : false},
                { title: 'Asr', time : skygge2?cleanTime(prey.Asr2):cleanTime(prey.Asr1), hasAlarm : $localstorage.hasValue("Asr"),id: 4, isActive : false,isNext : false},
                { title: 'Maghrib', time : cleanTime(prey.Magribh), hasAlarm : $localstorage.hasValue("Maghrib"),id: 5, isActive : false,isNext : false},
                { title: 'Isha', time : cleanTime(prey.Isha), hasAlarm : $localstorage.hasValue("Isha"), id: 6, isActive : false,isNext : false},
              
              ];
              renderCallBack(preyForDay);

        });
    };




    this.getPreyTimesForMonth = function(start,end,callback){

       var settings = $localstorage.getObject('settings');
       var city = "Oslo";
       var skygge2 = true;
       if(settings!=null && settings.city != null){
           city = settings.city;
       }
       $http.get('preytimes/'+city+'.js').success(function(data) {
          
            if(settings!=null){
            if(settings.city!=null){
                skygge2 = !settings.skygge2by;
            }else {
                skygge2 = !settings.skygge2;
            } 
            }
           

            var days = [];
             for(var i = start;i<=end;i++){

                 var prey = data[i-1]

            var day = [
                { title: 'Fajr', time :cleanTime(prey.Fajr), id: 1, isActive : false ,isNext : false},
                { title: 'Soloppgang',time :cleanTime(prey.Soloppgang), id: 2, isActive : false,isNext : false},
                { title: 'Dhuhr', time : cleanTime(prey.Duhr),id: 3, isActive : false,isNext : false},
                { title: 'Asr', time : skygge2?cleanTime(prey.Asr2):cleanTime(prey.Asr1),id: 4, isActive : false,isNext : false},
                { title: 'Maghrib', time : cleanTime(prey.Magribh),id: 5, isActive : false,isNext : false},
                { title: 'Isha', time : cleanTime(prey.Isha),id: 6, isActive : false,isNext : false},
              
              ];

               days.push(day);

            }
              callback(days);

        });
    };




    

 

    var cleanTime = function(bla){

        var array = bla.split(" ");
        var array2 = array[0].split(":");

        var hourPart = parseInt(array2[0]);

        if(array[1] == "PM" && hourPart<12 )
        {
            hourPart = hourPart +12;
        }

        return hourPart + ":" + array2[1];
        

    };

    

   
}).service('alarmService', function($localstorage,preyTimesService,$cordovaLocalNotification){



   
    var getAlarmIdFromPreyName = function(name){

        if(name == 'Fajr'){
            return 1; 
        }
        if(name == 'Soloppgang'){
            return 2; 
        }
         if(name == 'Dhuhr'){
            return 3; 
        }
         if(name == 'Asr'){
            return 4; 
        }
         if(name == 'Maghrib'){
            return 5; 
        }
        if(name == 'Isha'){
            return 6; 
        }
    };



    var getPreyNameAlarmId = function(id){

        if(id == "1"){
            return 'Fajr'; 
        }
        if(id == "2"){
            return 'Soloppgang'; 
        }
         if(id == "3" ){
            return 'Dhuhr'; 
        }
         if(id == "4" ){
            return 'Asr'; 
        }
         if(id == "5"){
            return 'Maghrib'; 
        }
        if(id == "6"){
            return 'Isha'; 
        }
    };


    this.getAlarmIdFromName = function(id){

        if(id == 1){
            return 'Fajr'; 
        }
        if(id == 2){
            return 'Soloppgang'; 
        }
         if(id == 3 ){
            return 'Dhuhr'; 
        }
         if(id == 4 ){
            return 'Asr'; 
        }
         if(id == 5){
            return 'Maghrib'; 
        }
        if(id == 6){
            return 'Isha'; 
        }
    };


    this.rescheduleAllAcitveAlarms = function(){

        $cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
            for(var i in scheduledIds){
                  before = $localstorage.get(getPreyNameAlarmId(i));
                  this.setAlarm(getPreyNameAlarmId(i),before,false);
            };
        });
  
    };


    this.cancelAlarm = function(prey) {
        var preyIndex = getAlarmIdFromPreyName(prey);
        $localstorage.set(prey,false);
        $cordovaLocalNotification.cancel(preyIndex).then(function () {
          console.log('callback for cancellation background notification');
        });
    };

    this.reschuldeAlarm = function(prey){

      if($localstorage.hasValue(prey)){
        var value =  $localstorage.get(prey);
       
        this.setAlarm(prey,value,true);
      };

    };

    this.setAlarm = function(prey, before,nextDay){
        var preyIndex = getAlarmIdFromPreyName(prey);
        $localstorage.set(prey,before);

        var dayOfYear = moment().dayOfYear();
        if(nextDay)
          dayOfYear++; 
        if(nextDay && dayOfYear>365)
          dayOfYear = 1; 
       

        preyTimesService.getPreyTimesForDay(dayOfYear, function(data){

            var prey = data[preyIndex-1];
            var date = moment();
            var res = prey.time.split(":");
            date = date.hours(res[0]);
            date = date.minutes(res[1]);
            date = date.add(-before, 'm');

            if(date<moment() || nextDay){
               date = date.add(1, 'd');
            }



        $cordovaLocalNotification.add({
            id: preyIndex,
            firstAt: date.toDate(),
            message: "Det er tid for " + getPreyNameAlarmId(preyIndex),
            title: "Det er tid for bønn!",
            every: "day",
            autoCancel: false
        }).then(function () {
            console.log("The notification has been set");
        });


          

        });
        
    };

  

 

   

    

   
})