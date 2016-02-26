angular.module('starter.controllers-messages', [])

    .controller('MessageCtrl', function($scope, $state, $stateParams,
                                       $ionicActionSheet, $ionicSlideBoxDelegate, $ionicHistory, $cordovaGeolocation, $http,
                                       Profile, Auth, Codes, Utils, CordovaCamera, Messages, recipientInfo) {


        $scope.$on('$ionicView.enter', function (e) {
            $scope.firstMessageBool = $stateParams.firstMessage;
            loadProfileData();
            initData();
            //console.log($scope.FormData);
        });

        $scope.$on('$ionicView.leave', function (e) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        function initData() {
            if (!$scope.ProfileData.profilePicture) {
                $scope.ProfileData.profilePicture = "";
            }

            $scope.recipientID = recipientInfo.getStateParams().recipientID;
            $scope.recipientUser = recipientInfo.getStateParams().recipientUser;

            $scope.FormData = {
                text: "",
                images: [],
                uid: Auth.AuthData.uid,
                username: $scope.ProfileData.meta.username,
                recipientID: $scope.recipientID,
                senderThumbnail: $scope.ProfileData.profilePicture,
                timestamp_create: Firebase.ServerValue.TIMESTAMP
            };
            //$scope.FormImages = [];
            $scope.AuthData = Auth.AuthData;
        };

        // Profile data
        // ---------------
        function loadProfileData() {
            // check if in cash
            if (Profile.ProfileData.hasOwnProperty('meta')) {
                $scope.ProfileData = Profile.ProfileData;
            } else {
                // otherwise load (note: AuthData.uid is resolved)
                Profile.get(Auth.AuthData.uid).then(
                    function (ProfileData) {
                        //console.log(ProfileData);
                        $scope.ProfileData = ProfileData;
                    },
                    function (error) {
                        console.log(error);
                        $scope.ProfileData = {};
                        Utils.showMessage('Oops... profile data not loaded', 1500)
                    }
                );
            }
            ;
        };

        $scope.addImage = function () {
            // Show the action sheet
            $ionicActionSheet.show({
                buttons: [
                    {text: 'Take a new picture'},
                    {text: 'Import from phone library'},
                ],
                titleText: 'Add an image to your post',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (sourceTypeIndex) {
                    proceed(sourceTypeIndex)
                    return true;
                }
            });
            function proceed(sourceTypeIndex) {
                CordovaCamera.newImage(sourceTypeIndex, 800).then(
                    function (ImageData) {
                        if (ImageData != null) {
                            //$scope.FormImages.push(ImageData);  old way
                            $scope.FormData.images.push(imageData) //new way
                            $ionicSlideBoxDelegate.update();
                        }
                    }
                );
            };
        };

        $scope.removeImage = function (index) {
            $scope.FormImages.splice(index, 1);
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.update();
        };

        $scope.slideHasChanged = function () {
            $ionicSlideBoxDelegate.update();
        };

        $scope.sendMessage = function () {
            if ($scope.firstMessageBool == 'true') {
                console.log('YAYY first message');

                $scope.UserData = {
                    lastMessage: "",
                    senderUsername: $scope.ProfileData.meta.username,
                    friendUsername: $scope.recipientUser,
                    senderThumbnail: $scope.ProfileData.profilePicture,
                    uid: Auth.AuthData.uid,
                    recipientID: $scope.recipientID
                };

                if ($scope.returnCount() >= 0) {
                    $scope.UserData.lastMessage = $scope.FormData.text;
                    Messages.sendMessage($scope.AuthData.uid, $scope.recipientID, $scope.UserData, $scope.FormData).then(
                        function (success) {

                            $scope.close();
                            initData();
                        })
                } else {
                    Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
                }
            }

            //if($scope.firstMessageBool == false) {
else {
                if ($scope.firstMessageBool == 'false') {
                    console.log('NOT FIRST MESSAGE, calling reply function instead');
                    $scope.sendReply();
                }
            }

        };

        $scope.returnCount = function () {
            if ($scope.FormData) {
                return POST_MAX_CHAR - $scope.FormData.text.length;
            }
        };
        $scope.close = function () {
            $state.go('tab.chats.messages', {recipientID: $scope.recipientID, recipientUsername: $scope.recipientUser},{reload: true});

            //  $state.go('tab.feed');
            //$state.go('tab.feed.Topic', {topic: $scope.topic});
        };

        $scope.sendReply = function () {
            Messages.getMessages(Auth.AuthData.uid, $scope.recipientID).then(function (response) {
                $scope.UserData = response.UserData;
                $scope.UserData['lastMessage'] = $scope.FormData.text;

                if ($scope.returnCount() >= 0) {
                    Messages.sendMessage($scope.AuthData.uid, $scope.recipientID, $scope.UserData, $scope.FormData).then(
                        function (success) {
                            $scope.close();
                            initData();
                        })
                } else {
                    Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
                }
            });
        };

    })
