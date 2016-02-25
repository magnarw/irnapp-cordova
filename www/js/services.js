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
      if(!settings.calendarCity){
              city = 'Oslo';

      }
       $http.get('preytimes/'+city+'.js').success(function(data) {
          
            if(settings!=null){
            if(settings.calendarCity==true){
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
        if(!settings.calendarCity){
              city = 'Oslo';
            }
       $http.get('preytimes/'+city+'.js').success(function(data) {
          
            if(settings!=null){
            if(settings.calendarCity!=null){
                skygge2 = settings.skygge2by;
            }else {
                skygge2 = settings.skygge2;
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



private DateTime getPrayTimeFromString(DateTime time, String timeToParse,int day, int month) {
    DateTimeFormatter fmt = DateTimeFormat.forPattern("h:mm:ss aa");
    LocalTime timeFromString = LocalTime.parse(timeToParse,fmt);
    System.out.println("Month, day, year:" + time.getMonthOfYear() + "," + time.getDayOfMonth() + "," + time.getYear());
    
    //clean up orginal calender
    if(time.getMonthOfYear()>=3 && time.getMonthOfYear()<=10){
      if(time.getMonthOfYear()==3 && time.getDayOfMonth()>=30){
        timeFromString = timeFromString.minusHours(1);
      }else if(time.getMonthOfYear()==10 && time.getDayOfMonth()<26){
        timeFromString = timeFromString.minusHours(1);
      }else if (time.getMonthOfYear()>3 && time.getMonthOfYear()<10){
        timeFromString = timeFromString.minusHours(1);
      }else if(time.getMonthOfYear() == 3 && time.getDayOfMonth() == 29 && time.getYear()==2016){
        timeFromString = timeFromString.minusHours(1);
      }
    }
    
    //create a new date starting at midnight with time zone gt+1
    DateTimeZone zone = DateTimeZone.forID("Europe/Amsterdam");
    DateTime dateToReturn = new DateTime( time.getYear(), time.getMonthOfYear(), time.getDayOfMonth(), timeFromString.getHourOfDay(), timeFromString.getMinuteOfHour(), 0, zone );
    
    System.out.println("date nå:" + dateToReturn.toString());
    //DateTime toReturn = time.plusHours(timeFromString.getHourOfDay()).plusMinutes(timeFromString.getMinuteOfHour());
    
    //adjust for summer time
    if(dateToReturn.getDayOfYear()>=getLastSundayInMarch(dateToReturn) && dateToReturn.getDayOfYear()<getLastSundayInOctober(dateToReturn)){
      dateToReturn = dateToReturn.plusHours(1);
    }
    System.out.println("date etter:" + dateToReturn.toString());
    //if(time.getDayOfYear() == getLastSundayInOctober(time))
    //  toReturn = toReturn.plusHours(1);
    
    
    
    //stuff to clean up summer time in the orginal calender(from 2013)

    
    return dateToReturn;
  
  }
    

 

    var cleanTime = function(bla,date){

        var array = bla.split(" ");
        var array2 = array[0].split(":");

        var hourPart = parseInt(array2[0]);

        if(date.month())>=3 && date.date()<=10){
           if(date.month())==3 && date.date()>=30){
                hourPart = hourpart -1;  
          }else if(date.month())==10 && date.date()<26){
              hourPart = hourpart -1;  
          }else if(date.month())>3 && date.date()<10){
              hourPart = hourpart -1; 
          }else if(date.month())==3 && date.date()<29 && time.year() == 2016){
               hourPart = hourpart -1; 
          }


        }

        if(date.isDST()){
          hourPart = hourPart +1; 
        }

 

        if(array[1] == "PM" && hourPart<12 )
        {
            hourPart = hourPart +12;
        }
        if(hourPart<10){
          return "0" + hourPart + ":" + array2[1];
        }else {
          return hourPart + ":" + array2[1];
        }

        
        

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
        console.log('Trying to scheduled all active alarms');
        var scheduledIds = ['1','2','3','4','5','6','7'];
            console.log("scheduledIds:" + scheduledIds);
            for(var i in scheduledIds){

               
                      // console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
                    if($localstorage.get(getPreyNameAlarmId(i)) >=0 ){
                   
                    console.log('bla:' + $localstorage.get(getPreyNameAlarmId(i)));
                       console.log('Alarmid:' + getPreyNameAlarmId(i));
                      before = $localstorage.get(getPreyNameAlarmId(i));
                      this.setUpdateAlarm(getPreyNameAlarmId(i),before,false);
                    }
                 

                 
            };
      
  
    };


    this.cancelAlarm = function(prey) {
        var preyIndex = getAlarmIdFromPreyName(prey);
        $localstorage.set(prey,false);
        $cordovaLocalNotification.cancel(preyIndex).then(function () {
           console.log('cancler alarm ' + prey);
          
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

        console.log("setter prey index:" + preyIndex)
        console.log("date:" + date.toDate());
        cordova.plugins.notification.local.schedule({
            id: preyIndex,
            at: date.toDate(),
            text: "Det er tid for " + getPreyNameAlarmId(preyIndex),
            title: "Det er tid for bønn!",
            every: "day",
           
            sound  : 'file://sounds/alarm.mp3'
        }).then(function () {
            console.log("The notification has been set");
        });


          

        });
        
    };


       this.setUpdateAlarm = function(prey, before,nextDay){
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

        console.log("setter prey index:" + preyIndex)
        console.log("date:" + date.toDate());
        cordova.plugins.notification.local.update({
            id: preyIndex,
            at: date.toDate(),
            text: "Det er tid for " + getPreyNameAlarmId(preyIndex),
            title: "Det er tid for bønn!",
            every: "day",
           
            sound  : 'file://sounds/alarm.mp3'
        }).then(function () {
            console.log("The notification has been set");
        });


          

        });
        
    };
  

 

   

    

   
})