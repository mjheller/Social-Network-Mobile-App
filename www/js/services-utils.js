angular.module('starter.services-utils', [])

/**
 * All other complementary functions
 */
.factory('Utils', function($ionicLoading, $timeout) {
  var self = this;

  //
  // ionic loading notification
  self.showMessage = function(message, optHideTime) {
    if(optHideTime != undefined && optHideTime > 100) {
      // error message or notification (no spinner)
      $ionicLoading.show({
          template: message
      });
      $timeout(function(){
          $ionicLoading.hide();
      }, optHideTime)
    } else {
      // loading (spinner)
      $ionicLoading.show({
          template: message + '<br><br>' + '<ion-spinner class="spinner-modal"></ion-spinner>'
      });
      
      $timeout(function(){    // close if it takes longer than 10 seconds
          $ionicLoading.hide();
          //self.showMessage("Timed out", 2000);
      }, 20000)
      
    }
  };

  self.arrayValuesAndKeys = function(targetObject) {
    return Object.keys(targetObject).map(
      function (key) {
        return {
          key: key,
          value: targetObject[key]
        }
      }
    );
  };

  self.arrayValues = function(targetObject) {
    return Object.keys(targetObject).map(
      function (key) {
        return targetObject[key]
      }
    );
  };

  self.arrayKeys = function(targetObject) {
    return Object.keys(targetObject).map(
      function (key) {
        return key;
      }
    );
  };

  self.sortArray = function(targetObject, sortOptions) {
    console.log(targetObject)
    var sortProperty = sortOptions.property.toLowerCase();
    if(sortProperty == 'date') {
      sortProperty = "timestamp_creation";
    }
    switch(sortOptions.method){
      case 'asc':
        //
        return targetObject.sort(compareDesc);
      break
      case 'desc':
        //
        return targetObject.sort(compareAsc);
      break
    }
    function compareDesc(a,b) {
        a = a['value'];
        b = b['value'];
        console.log(a, b)
        if (a[sortProperty] < b[sortProperty])
            return -1;
        else if (a[sortProperty] > b[sortProperty])
            return 1;
        else
            return 0;
    };
    function compareAsc(a,b) {
        a = a['value'];
        b = b['value'];
        if (a[sortProperty] > b[sortProperty])
            return -1;
        else if (a[sortProperty] < b[sortProperty])
            return 1;
        else
            return 0;
    };
  };

  self.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  self.formatTimestamp = function(timestamp) {
    var date = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  };
  
  
  self.timeSince = function(unix_timestamp) {
    
    var date = new Date(unix_timestamp);
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  

  return self;
})
