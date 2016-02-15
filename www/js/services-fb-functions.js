angular.module('starter.services-fb-functions', [])

/**
 * Generic Firebase Functions (get, set, push, remove, etc.) wrapped in promises
 */
.factory('FireFunc', function($q) {
  var self = this;
  
  
  // fn get snapshot.val() 
  self.onValue = function(childRef) {
    var qGet = $q.defer();
    var ref = new Firebase(FBURL);
    ref.child(childRef).on("value", function(snapshot) {
      qGet.resolve(snapshot.val());
    }, function (errorObject) {
      qGet.reject(errorObject);
    });
    return qGet.promise;
  };
  
  // fn set
  self.set = function(childRef, SetObject) {
    var qUpdate = $q.defer();
    var ref = new Firebase(FBURL);
    var onComplete = function(error) {
      if (error) {
        qUpdate.reject(error);
      } else {
        qUpdate.resolve("SET_SUCCESS");
      }
    };
    ref.child(childRef).set(SetObject, onComplete);
    return qUpdate.promise;
  };
  
  self.remove = function(childRef) {
    var qRemove = $q.defer();
    var ref = new Firebase(FBURL);
    var onComplete = function(error) {
      if (error) {
        qRemove.reject(error);
      } else {
        qRemove.resolve("REMOVE_SUCCESS");
      }
    };
    ref.child(childRef).remove(onComplete);
    return qRemove.promise;
  };

  return self;
})
