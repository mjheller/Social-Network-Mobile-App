angular.module('starter.controllers-submit', [])

  .controller('SubmitCtrl', function($scope, $state,
                                     $ionicActionSheet, $ionicSlideBoxDelegate, $ionicHistory, $cordovaGeolocation, $http,
                                     Profile, Auth, Codes, Utils, CordovaCamera, Timeline, currentTopic) {


    $scope.$on('$ionicView.enter', function(e) {
      loadProfileData();
      initData();
      //console.log($scope.FormData);
    });

    // Form
    // ---------------
    function initData() {
      if (!$scope.ProfileData.profilePicture){
        $scope.ProfileData.profilePicture = "";
      }
      console.log($scope.ProfileData);
      $scope.topic = currentTopic.getStateParams().topic;
      console.log($scope.topic);
      $scope.FormData = {
        meta: {
          username: $scope.ProfileData.meta.username,
          thumbnail: $scope.ProfileData.profilePicture,
          text: "",
          topic: $scope.topic,
          location: $scope.ProfileData.location,
          images: [],
        },
        uid: Auth.AuthData.uid,
        timestamp_create: Firebase.ServerValue.TIMESTAMP
      };
      //$scope.FormImages = [];
      $scope.AuthData = Auth.AuthData;
    };

    // Profile data
    // ---------------
    function loadProfileData(){
      // check if in cash
      if(Profile.ProfileData.hasOwnProperty('meta')){
        $scope.ProfileData = Profile.ProfileData;
      } else {
        // otherwise load (note: AuthData.uid is resolved)
        Profile.get(Auth.AuthData.uid).then(
          function(ProfileData){
            //console.log(ProfileData);
            $scope.ProfileData = ProfileData;
          },
          function(error){
            console.log(error);
            $scope.ProfileData = {};
            Utils.showMessage('Oops... profile data not loaded', 1500)
          }
        );
      };
    };


    $scope.addImage = function() {
      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          { text: 'Take a new picture' },
          { text: 'Import from phone library' },
        ],
        titleText: 'Add an image to your post',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(sourceTypeIndex) {
          proceed(sourceTypeIndex)
          return true;
        }
      });
      function proceed(sourceTypeIndex) {
        CordovaCamera.newImage(sourceTypeIndex, 800).then(
          function(ImageData){
            if(ImageData != null) {
              //$scope.FormImages.push(ImageData);  old way
              $scope.FormData.images.push(imageData) //new way
              $ionicSlideBoxDelegate.update();
            }
          }
        );
      };
    };

    $scope.removeImage = function(index) {
      $scope.FormImages.splice(index, 1);
      $ionicSlideBoxDelegate.slide(0);
      $ionicSlideBoxDelegate.update();
    };

    $scope.slideHasChanged = function () {
      $ionicSlideBoxDelegate.update();
    };

    //// Submit               OLD
    //// ----------------
    //$scope.submitPost = function() {
    //  if($scope.returnCount()>=0){
    //    Timeline.addPost($scope.AuthData.uid, $scope.FormData, $scope.FormImages).then(
    //      function(success){
    //        $state.go('tab.timeline');
    //        initData();
    //      })
    //  } else {
    //    Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
    //  }
    //};

    // Submit
    // ----------------
    $scope.submitPost = function() {
      if($scope.returnCount()>=0){
        Timeline.addPost($scope.AuthData.uid, $scope.FormData).then(
          function(success){
            //$state.go('tab.feed.Topic', {topic: $scope.topic});
            $state.go('tab.feed');
            initData();
          })
      } else {
        Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
      }
    };

    // Add GPS location
    // ---------------
    $scope.addLocation = function() {
      var posOptions = {enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&sensor=true").then(function(response) {
            $scope.FormData.meta.location = response.data.results[5].formatted_address;
          });


        }, function(err) {
          // error
        });
    };


    // Other
    // ---------------

    $scope.close = function() {
      $state.go('tab.feed');
    };

    $scope.returnCount = function() {
      if($scope.FormData){
        return POST_MAX_CHAR - $scope.FormData.meta.text.length;
      }
    };

  })

