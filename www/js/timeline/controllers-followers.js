angular.module('starter.controllers-followers', [])

/**
 * This version: 25/07/2015
 * Upcoming versions: Multi-Location Updates and more consistency
 */
.controller('FollowersCtrl', function(
    $scope,
    Auth, Codes, Utils, Profile, Followers) {

    $scope.tempData = {noProfilePicture: "img/ionic.png"};
    $scope.loadingMode = true;
    $scope.searchUser = {value: ""};

    $scope.FollowingList = Followers.FollowingList;
    $scope.FollowingProfiles = Followers.FollowingProfiles;
    doRefresh();

    $scope.$on('$rootScope.refresh', function(){ // called when logged out for instance
        Followers.resetFollowing();
        $scope.doRefresh();
    });

    $scope.doRefresh = function() {
        doRefresh();
    };

    function doRefresh() {

        $scope.AuthData = Auth.AuthData;

        if($scope.AuthData.hasOwnProperty('uid')) {
            Followers.refreshFollowing($scope.AuthData.uid).then(
                function(success){
                    refreshComplete();
                }, function(error){
                    refreshComplete();
                    handleError(error)
                }
            )
        } else {
            refreshComplete();
        };


    };

    //
    function refreshComplete() {
        $scope.FollowingList = Followers.FollowingList;
        $scope.FollowingProfiles = Followers.FollowingProfiles;

        $scope.searchUser = {value: ""};
        $scope.loadingMode = false;
        $scope.$broadcast('scroll.refreshComplete');
    };


    // -------------------------------------------------------------------------
    //
    // Add / Delete
    //
    // -------------------------------------------------------------------------

    $scope.addFollower = function() {
        if($scope.searchUser.value) {
            Utils.showMessage("Searching for user...");

            Followers.addFollower($scope.AuthData.uid, $scope.searchUser.value, true).then(
                function(success){
                    Utils.showMessage("Adding user...", 1000);
                    doRefresh();
                }, function(error){
                    handleError(error)
                }
            )

        }
    };

    $scope.stopFollowing = function(fid) {
        console.log("stopFollowing", fid)
        if(fid) {
            Followers.stopFollowing($scope.AuthData.uid, fid).then(
                function(success){
                    doRefresh();
                }, function(error){
                    handleError(error)
                }
            )
        }
    };


    // -------------------------------------------------------------------------
    //
    // Other (can be put in service)
    //
    // -------------------------------------------------------------------------


    /**
    * Translates error codes to the language of commoners
    * Todo: put in service for consistency
    */
    function handleError(error) {
        Codes.handleError(error);
    };






})
