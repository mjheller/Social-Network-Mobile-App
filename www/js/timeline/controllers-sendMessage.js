angular.module('starter.controllers-messages', [])

    .controller('MessageCtrl', function($scope, $state,
                                       $ionicActionSheet, $ionicSlideBoxDelegate, $ionicHistory, $cordovaGeolocation, $http,
                                       Profile, Auth, Codes, Utils, CordovaCamera, Messages, recipientInfo) {


        $scope.$on('$ionicView.enter', function(e) {
            loadProfileData();
            initData();
            //console.log($scope.FormData);
        });

        function initData() {
            if (!$scope.ProfileData.profilePicture){
                $scope.ProfileData.profilePicture = "";
            }
            console.log($scope.ProfileData);
            $scope.recipientID = recipientInfo.getStateParams().recipientID;
            $scope.recipientUser = recipientInfo.getStateParams().recipientUser;
            $scope.UserData = {
                lastMessage: "",
                username: $scope.ProfileData.meta.username,
                senderThumbnail: $scope.ProfileData.profilePicture,
                uid: Auth.AuthData.uid,
                recipientID: $scope.recipientID,
            };
            $scope.FormData = {
                text: "",
                images: [],
                uid: Auth.AuthData.uid,
                username: $scope.ProfileData.meta.username,
                recipientID: $scope.recipientID,
                senderThumbnail: $scope.ProfileData.profilePicture,
                timestamp_create:  Firebase.ServerValue.TIMESTAMP
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

        $scope.sendMessage = function() {
            if($scope.returnCount()>=0){
                $scope.UserData.lastMessage = $scope.FormData.text;
                Messages.sendMessage($scope.AuthData.uid, $scope.recipientID, $scope.UserData, $scope.FormData).then(
                    function(success){
                        //$state.go('tab.feed.Topic', {topic: $scope.topic});
                        $state.go('tab.chats');
                        initData();
                    })
            } else {
                Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
            }
        };

        $scope.returnCount = function() {
            if($scope.FormData){
                return POST_MAX_CHAR - $scope.FormData.text.length;
            }
        };

        $scope.close = function() {
            $state.go('tab.feed');
        };
    })
