angular.module('starter.controllers-account', [])

.controller('AccountCtrl', function(
  $rootScope, $scope, $state, $stateParams, $timeout,
  $ionicModal, $ionicHistory, $ionicPopup, $ionicActionSheet, $cordovaGeolocation, $http,
  Auth, Profile, Codes, Utils) {

  // ----
  // Init other

  // global variables
  $scope.AuthData = Auth.AuthData;

  // communicates with the DOM
  $scope.status = {
    loading: true,
    loadingProfile: true,
    changePasswordMode: "lost",
    updateMessage: "Update account", //default
    updateButtonClass: 'button-positive', //default
    toggleLoginManual: false,
  };


  /**
  * ---------------------------------------------------------------------------------------
  * AuthState monitoring
  * ---------------------------------------------------------------------------------------
  */

  $scope.$on('$ionicView.enter', function(e) {

    // -->
    checkAuth();

  });

  // monitor and redirect the user based on its authentication state
  function checkAuth() {
    $scope.AuthData = Auth.AuthData;
    if(!$scope.AuthData.hasOwnProperty('uid')){
      Auth.getAuthState().then(
        function(AuthData){
          $scope.AuthData = AuthData;
          handleLoggedIn();
        },
        function(notLoggedIn){
          handleLoggedOut();
        }
      )
    } else {
      handleLoggedIn();
    };
  }; // ./ checkAuth()

  // handles when the user is logged in
  function handleLoggedIn() {

    // @dependency
    loadProfileData();

    // proceed to next state if specified (for instance when user comes from foreign state)
    if($stateParams.nextState != undefined && $stateParams.nextState != null && $stateParams.nextState != "") {
      $state.go($stateParams.nextState);
    }


  };

  // handles when the user is logged out
  function handleLoggedOut() {
    openLogin();
    $scope.status['loadingProfile'] = false;

    // if for some reason the modals are not automatically opened, show a button
    $timeout(function(){
      $scope.status['toggleLoginManual'] = true;
    }, 1500);
  };

  // update auth status in other controllers
  function broadcastAuthChange() {
    $rootScope.$broadcast('rootScope:authChange', {});
  };




  /**
  * ---------------------------------------------------------------------------------------
  * MODAL: Login
  * ---------------------------------------------------------------------------------------
  */

  // Form data for the login modal
  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/auth/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('tab.timeline');
  };

  // Open the login modal
  $scope.login = function() {
    openLogin();
  };
  function openLogin() {
    if($scope.modal != undefined) {
      $scope.modal.show();
    } else {
      $timeout(function(){
        openLogin();
      }, 1500)
    }
  };

  $scope.unAuth = function() {
    Auth.unAuth();

    $scope.AuthData = {};
    $scope.ProfileData = {};

    $scope.loginData = {};
    $scope.signUpData = {};           $scope.closeSignUp();
    $scope.changeEmailData = {};      $scope.closeChangeEmail();
    $scope.changePasswordData = {};   $scope.closeChangePassword();
    $scope.setProfileData = {};       $scope.closeSetProfile();

    broadcastAuthChange();
    handleLoggedOut();
  };

  // Perform the login action when the user submits the login form

  $scope.doLoginSocial = function(provider) {
    Auth.signInSocial(provider).then(
      function(AuthData){
        // -->

        proceedLogin(AuthData);
      },
      function(error){
        Codes.handleError(error);
      }
    )
  };

  $scope.doLogin = function() {
    if($scope.loginData.userEmail && $scope.loginData.userPassword) {
      Utils.showMessage("Signing in user... ");
      Auth.signInPassword($scope.loginData.userEmail, $scope.loginData.userPassword).then(
        function(AuthData){

          // -->
          proceedLogin(AuthData);

        },
        function(error){
          Codes.handleError(error);
        }
      )
    }
  };

  // wrapper for email and social login
  function proceedLogin(AuthData) {
    // hide modals
    $scope.modal.hide();
    $scope.modalSignUp.hide();
    $scope.modalChangePassword.hide();

    broadcastAuthChange();
    Utils.showMessage("Signed in!", 500);

    // handle logged in
    $scope.AuthData = AuthData;
    handleLoggedIn();
  };


  // ---------------------------------------------------------------------------
  //
  // MODAL: Sign Up
  //
  // ---------------------------------------------------------------------------

  // Form data for the signUp modal
  $scope.signUpData = {};

  // Create the signUp modal that we will use later
  $ionicModal.fromTemplateUrl('templates/auth/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSignUp = modal;
  });
  $scope.closeSignUp = function() {
    $scope.modalSignUp.hide();
    $scope.modal.show();
  };
  $scope.signUp = function() {
    console.log('test')
    $scope.modal.hide();
    $scope.modalSignUp.show();
  };
  $scope.doSignUp = function() {       console.log('Doing signUp', $scope.signUpData);
    if($scope.signUpData.userEmail && $scope.signUpData.userPassword) {
        Utils.showMessage("Creating user... ");
        Auth.signUpPassword($scope.signUpData.userEmail, $scope.signUpData.userPassword).then(
            function(AuthData){

                $scope.loginData = $scope.signUpData;
                $scope.doLogin();

            }, function(error){
                Codes.handleError(error)
            }
        )
    } else {
        Codes.handleError({code: "INVALID_INPUT"})
    }
  };



  // ---------------------------------------------------------------------------
  //
  // MODAL: Change Password
  //
  // ---------------------------------------------------------------------------

  // Form data for the signUp modal
  $scope.changePasswordData = {};

  // Create the signUp modal that we will use later
  $ionicModal.fromTemplateUrl('templates/auth/change-password.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalChangePassword = modal;
  });
  $scope.closeChangePassword = function() {
    $scope.modalChangePassword.hide();
    if($scope.status.changePasswordMode == 'lost') {
      $scope.modal.show();
    }
  };
  $scope.changePassword = function(mode) {
    // when authenticated
    if($scope.AuthData.hasOwnProperty('password')){
      $scope.changePasswordData = {
          userEmail: $scope.AuthData.password.email
      }
    }
    $scope.status['changePasswordMode'] = mode;
    $scope.modal.hide();
    $scope.modalChangePassword.show();
  };

  //
  // step 1: reset password
  //
  $scope.resetPassword = function() {
      if($scope.changePasswordData.userEmail) {
        Utils.showMessage("Resetting password");
        Auth.resetPassword(
            $scope.changePasswordData.userEmail).then(
            function(success){
                Utils.showMessage("Password has been reset. Please check your email for the temporary password", 2000);
                $scope.status['changePasswordMode'] = 'change';
            }, function(error){
                Codes.handleError(error)
            }
        )
    } else {
        Codes.handleError({code: "INVALID_INPUT"})
    }
  };

  //
  // step 2: change password
  //
  $scope.doChangePassword = function() {
    if($scope.changePasswordData.userEmail && $scope.changePasswordData.oldPassword && $scope.changePasswordData.newPassword) {
        Utils.showMessage("Changing password... ");
        Auth.changePassword(
            $scope.changePasswordData.userEmail,
            $scope.changePasswordData.oldPassword,
            $scope.changePasswordData.newPassword).then(
            function(AuthData){

                //
                Utils.showMessage("Password Changed!");
                //
                $scope.loginData = {
                    userEmail: $scope.changePasswordData.userEmail,
                    userPassword: $scope.changePasswordData.newPassword,
                }
                $scope.doLogin();

            }, function(error){
                Codes.handleError(error)
            }
        )
    } else {
        Codes.handleError({code: "INVALID_INPUT"})
    }
  };


  // ---------------------------------------------------------------------------
  //
  // MODAL: Change E-mail
  //
  // ---------------------------------------------------------------------------

  // Form data for the login modal
  $scope.changeEmailData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/auth/change-email.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalChangeEmail = modal;
  });
  $scope.closeChangeEmail = function() {
    $scope.modalChangeEmail.hide();
  };
  $scope.changeEmail = function() {
    // when authenticated
    if($scope.AuthData.hasOwnProperty('password')){
        $scope.changeEmailData = {
            oldEmail: $scope.AuthData.password.email
        }
    }
    $scope.modal.hide();
    $scope.modalChangeEmail.show();
  };
  $scope.doChangeEmail = function() {       console.log('changeEmail', $scope.changeEmailData);
    if($scope.changeEmailData.oldEmail && $scope.changeEmailData.newEmail && $scope.changeEmailData.userPassword) {

        Utils.showMessage("Changing e-mail...")

        Auth.changeEmail(
            $scope.changeEmailData.oldEmail,
            $scope.changeEmailData.newEmail,
            $scope.changeEmailData.userPassword).then(
            function(success){

                //
                $scope.closeChangeEmail();
                Utils.showMessage("E-mail changed!", 500)

            }, function(error){
                Codes.handleError(error)
            }
        )
    } else {
        Codes.handleError({code: "INVALID_INPUT"})
    }
  };




  // ---------------------------------------------------------------------------
  //
  // MODAL: Set username and displayname
  //
  // ---------------------------------------------------------------------------

  // Form data for the login modal
  $scope.setProfileData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/auth/change-profile.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSetProfile = modal;
  });

  $scope.closeSetProfile = function() {
    $scope.modalSetProfile.hide();
  };

  $scope.setProfile = function() {
    openSetProfile();
  };
  function openSetProfile() {
    if($scope.modalSetProfile != undefined) {
      $scope.modalSetProfile.show();
    } else {
      $timeout(function(){
        openSetProfile();
      }, 1500)
    }
  };

  $scope.finishSetProfile = function() {
    if($scope.ProfileData.hasOwnProperty('meta')){
      if($scope.ProfileData.meta.hasOwnProperty('username') && $scope.ProfileData.meta.hasOwnProperty('displayName')) {
        $scope.modalSetProfile.hide();
        $state.go('tab.timeline');
      } else {
        Codes.handleError({code: "PROFILE_NOT_SET"})
      }
    } else {
      Codes.handleError({code: "PROFILE_NOT_SET"})
    }
  };







  /**
  * ---------------------------------------------------------------------------------------
  * Update profile (delivery details in this exercise)
  * ---------------------------------------------------------------------------------------
  */

  $scope.ProfileData = {};
  function loadProfileData() {
    $scope.status['loadingProfile'] = true;
    if($scope.AuthData.hasOwnProperty('uid')){
      Profile.get($scope.AuthData.uid).then(
        function(ProfileData) {

          // bind to scope
          if(ProfileData != null) {
            $scope.ProfileData = ProfileData;
          };

          // @dependency
          // Must have set username and displayname
          if(preparePopupData('meta', 'username') && preparePopupData('meta', 'displayName')) {
            $scope.status['loadingProfile'] = false; // duplicate**
            $scope.status['loading'] = false;
          } else {
            $scope.status['loadingProfile'] = false; // duplicate**
            $scope.setProfile();
          }
        }
      ),
      function(error){
        $scope.status['loadingProfile'] = false;
        $scope.status['loading'] = false;
      }
    };
  };

  // popup generic
  var myPopup;
  $scope.popupData = {};
  function showPopup(title, inputStr) {
    $scope.popupData['inputStr'] = inputStr;
    myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="popupData.inputStr">',
    title: title,
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.popupData.inputStr) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.popupData.inputStr;
          }
        }
      }
    ]
    });
  }

  // fn change
  $scope.changeDisplayName = function() {
    showPopup('Change display name', preparePopupData('meta', 'displayName'));
    myPopup.then(function(newDisplayName) {
      if(newDisplayName != undefined && newDisplayName != null) {
        Profile.setSub($scope.AuthData.uid, "meta", "displayName", newDisplayName).then(
          function(success){
            loadProfileData();
          }
        );
      };
    });
  };

  // fn change username
  $scope.changeUsername = function() {
    showPopup('Change username', preparePopupData('meta', 'username'));
    myPopup.then(function(newUsername) {
      if(newUsername != undefined && newUsername != null) {
        Profile.changeUserName($scope.AuthData.uid, newUsername).then(
          function(returnObj){
            if(returnObj != "USERNAME_TAKEN") {
              loadProfileData();
            } else {
              $timeout(function(){
                $scope.changeUsername();  //reopen
              }, 1500)
            }
          }
        )
      }
    });
  };

  // fn helper
  function preparePopupData(globalProperty, subProperty){
    if($scope.ProfileData.hasOwnProperty(globalProperty)){
      if($scope.ProfileData[globalProperty].hasOwnProperty(subProperty)){
        return $scope.ProfileData[globalProperty][subProperty];
      } else { return "";};
    } else { return "";};
  };
                                                                            ////////////////////////////////
  $scope.setGPSLocation = function() {
    $ionicActionSheet.show({
      buttons: [
        {text: 'Use current coordinates'},
        {text: 'Choose city manually'},
      ],
      titleText: 'Set your location',
      cancelText: 'Cancel',
      cancel: function () {
        // add cancel code..
      },
      buttonClicked: function (index) {
        if (index === 0) {
          var posOptions = {enableHighAccuracy: false};
          $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                console.log(lat, long);
                $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=true").then(function (response) {
                  console.log(response.data.results[3].formatted_address);
                  var loc = response.data.results[3].formatted_address
                  Profile.setUserLocation($scope.AuthData.uid, loc);
                  loadProfileData();

                });
              });
        }
        ;

        if (index === 1) {
          //add manual selection logic here
        }
        ;
      }
    });
  };



  // fn update profile picture
  $scope.changeProfilePicture = function() {
    // Show the action sheet

    $ionicActionSheet.show({
        buttons: [
            { text: 'Use facebook picture'},
            { text: 'Take a new picture' },
            { text: 'Import from phone library' },
        ],
        titleText: 'Change your profile picture',
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
        },

        buttonClicked: function(index, sourceTypeIndex) {
          if (index === 1 || 2){
            console.log(index);
            proceed(sourceTypeIndex)
            return true;
          };
          if (index === 0) {
            Profile.setFbProfilePicture($scope.AuthData.uid, $scope.AuthData.facebook.profileImageURL);
            return true;
          }
        }
    });
    function proceed(sourceTypeIndex) {
      Profile.changeProfilePicture(sourceTypeIndex, $scope.AuthData.uid).then(
        function(success){
          loadProfileData();
        }
      );
    };
  };



  /**
  * ---------------------------------------------------------------------------------------
  * Update other settings
  * ---------------------------------------------------------------------------------------
  */

  $ionicModal.fromTemplateUrl('templates/auth/change-account-other.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.otherModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeOther = function() {
    $scope.otherModal.hide();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('tab.account');
  };

  // Open the login modal
  $scope.other = function() {
    openOther();
  };
  function openOther() {
    if($scope.otherModal != undefined) {
      $scope.otherModal.show();
      loadOtherData();
    } else {
      $timeout(function(){
        openOther();
      }, 1500)
    }
  };

  $scope.OtherData = {};
  function loadOtherData() {
    $scope.status['loadingOtherData'] = true;
    if($scope.AuthData.hasOwnProperty('uid')){
      Profile.get($scope.AuthData.uid).then(
        function(ProfileData) {

          // bind to scope
          if(ProfileData != null) {
            $scope.ProfileData  = ProfileData;
            if(ProfileData.hasOwnProperty('other')) {
              $scope.OtherData    = ProfileData.other;
            }
          };

          $scope.status['loadingOtherData'] = false;
        }
      ),
      function(error){
        $scope.status['loadingOtherData'] = false;
      }
    };
  };

  $scope.saveOtherData = function() {
    if($scope.OtherData.city || $scope.OtherData.month || $scope.OtherData.bio) {
      Profile.setGlobal($scope.AuthData.uid, 'other', $scope.OtherData);
    }
  };


});
