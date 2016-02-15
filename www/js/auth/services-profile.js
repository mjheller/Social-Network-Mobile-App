angular.module('starter.services-profile', [])

/**
* Retrieves and sets the ProfileData (delivery details in this exercise)
* node: users/$globalProperty/$uid
*
* @params:    $uid                the user id as set by firebase
* @params:    $globalProperty:    the global property that separates user data
*                                 for instance: profilePicture and meta data of
*                                 the user are put in separate nodes (efficient loading)
*/
.factory('Profile', function($q, FireFunc, Utils, Codes, CordovaCamera) {
  var self = this;

  self.ProfileData = {}; //cache

  // GET  users/$uid
  self.get = function(uid) {
    var childRef = "users/" + uid;
    return FireFunc.onValue(childRef).then(
      function(ProfileData){
        // write to cache
        self.ProfileData = ProfileData;
        return ProfileData;
      },
      function(error){
        return error;
      }
    );
  };

  // GET  users/$uid/$globalProperty
  self.getGlobal = function(uid, globalProperty) {
    var childRef = "users/" + uid + "/" + globalProperty;
    return FireFunc.onValue(childRef).then(
      function(ProfileData){
        // write to cache
        self.ProfileData = ProfileData;
        return ProfileData;
      },
      function(error){
        return error;
      }
    );
  };

  // GET  users/$uid/$globalProperty/property
  self.getSub = function(uid, globalProperty, subProperty) {
    var childRef = "users/" + uid + "/" + globalProperty + "/" + subProperty;
    return FireFunc.onValue(childRef);
  };

  // SET  users/$uid/$globalProperty
  self.setGlobal = function(uid, globalProperty, globalValue) {
    var childRef = "users/" + uid +"/" + globalProperty;
    Utils.showMessage("Updating profile...");
    return FireFunc.set(childRef, globalValue).then(
      function(successCallback){
        Utils.showMessage("Profile updated", 750);
        return successCallback;
      },
      function(error){
        Codes.handleError(error);
        return error;
      }
    );
  };

  // SET  users/$uid/$globalProperty/property
  self.setSub = function(uid, globalProperty, subProperty, subValue) {
    var childRef = "users/" + uid +"/" + globalProperty + "/" + subProperty;
    Utils.showMessage("Updating profile...");
    return FireFunc.set(childRef, subValue).then(
      function(successCallback){
        Utils.showMessage("Profile updated", 750);
        return successCallback;
      },
      function(error){
        Codes.handleError(error);
        return error;
      }
    );
  };

  // SET  users/$uid/profilePicture
  self.changeProfilePicture = function(sourceTypeIndex, uid) {
    return CordovaCamera.newImage(sourceTypeIndex, 200).then(
      function(imageData){
        if(imageData != undefined) {
          return self.setGlobal(uid, 'profilePicture', imageData);
        } else {
          return imageData;
        }
      }, function(error){
        Codes.handleError(error);
      }
    );
  };
  // SET users/$uid/profilePicture
  // SET to users facebook profile by default


  self.setFbProfilePicture = function(uid, imgURL){
    //var img = AuthData.facebook.profileImageURL;
    if (imgURL != undefined){
      self.setGlobal(uid,'profilePicture', imgURL);
    } else {}

  };

  self.setUserLocation = function(uid, locationString){
      self.setGlobal(uid,'location', locationString);
  }

  // VALIDATE   usernames/$username === null
  // GET        users/$uid/meta/username (old)    proceed0
  // SET        users/$uid/meta/username (new)    proceed2c
  // DELETE     usernames/$username (old)         proceed2a
  // SET        usernames/$username (new)         proceed2b
  self.changeUserName = function(uid, newUsername) {

    // 0    validate if username taken
    var newUsernamesRef = "usernames/" + newUsername;
    return FireFunc.onValue(newUsernamesRef).then(
      function(snapshot){
        if(snapshot == null) {
          return proceed1();
        } else {
          Codes.handleError({code: "USERNAME_TAKEN"});
          return "USERNAME_TAKEN";
        }
      },
      function(error){
        return error;
      }
    );

    function proceed1() {
      // 1  get the current username
      var oldMetaRef = "users/" + uid + "/meta/username"
      return FireFunc.onValue(oldMetaRef).then(
        function(oldUsername){
          return proceed2(oldUsername);
        },
        function(error){
          return error;
        }
      )
    };

    function proceed2(oldUsername) {

      // *** todo in v2.1: rewrite to leverage .update()
      // More about Firebase Multi-Location Updates (available from v2.3)
      // on their website
      //
      // Example:
      // var pathData = {};
      // pathData['/usernames/' + oldUsername] = null;
      // pathData['/usernames/' + newUsername] = uid;
      // FireFunc.update(ref);

      // 2ab  set, handle node usernames in the background
      var oldUsernamesRef = "usernames/" + oldUsername;
      var newUsernamesRef = "usernames/" + newUsername;
      FireFunc.remove(oldUsernamesRef);
      FireFunc.set(newUsernamesRef, uid);

      // 2c   set, update meta
      return self.setSub(uid, 'meta', 'username', newUsername);
    };

  };

  return self;
});
