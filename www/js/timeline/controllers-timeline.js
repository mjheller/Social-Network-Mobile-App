angular.module('starter.controllers-timeline', [])

.controller('TimelineCtrl', function($scope, $state, $stateParams,
  $ionicSlideBoxDelegate, $ionicPopup, $ionicActionSheet, $ionicHistory,
  Auth, Timeline, Utils, Profile) {

  $scope.status = {
    loading: true,
    loadingProfile: false,
  };
  $scope.AuthData = Auth.AuthData;
  $scope.loadingPosts = {
    'image': {},
  };

  // used to avoid sticky header
  $scope.$on('$ionicView.leave', function(){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  });

  $scope.$on('$ionicView.enter', function(){
    if($stateParams.uid != undefined && $stateParams.uid != null && $stateParams.uid != "") {
      // view the timeline of user
      $scope.status['uid'] = $stateParams.uid;
      reLoad();
    } else {
      // otherwise load users profile
      if($scope.AuthData.hasOwnProperty('uid')){
        $scope.status['uid'] = $scope.AuthData.uid;
        reLoad();
      } else {
        $state.go('tab.account');
      }
    };
  });

  $scope.doRefresh = function() {
    // do not toggle loadingmode when just refresh
    loadTimeline();
  };

  function reLoad() {

    $scope.ProfileData = {};
    $scope.PostsData = {};

    $scope.status['loading'] = true; // toggle loading mode when enter
    loadTimeline();
    loadProfileData();
  };

  // ------


  $scope.ProfileData = {};
  function loadProfileData() {
    //console.log($scope.status['uid'])
    $scope.status['loadingProfile'] = true;
    if($scope.status['uid']){
      Profile.get($scope.status['uid']).then(
        function(ProfileData) {
          if(ProfileData != null) {
            $scope.ProfileData = ProfileData;
          };
          $scope.status['loadingProfile'] = false;
        }
      ),
      function(error){
        $scope.status['loadingProfile'] = false;
      }
    };
  };

  function loadFeed(){

  }



  $scope.PostsData= {};
  function loadTimeline() {
    Timeline.getMyPosts($scope.status['uid']).then(
      function(PostsData){
        if(PostsData != null) {
          // convert to array for sorting in ng-repeat without filters
          // returns array with array[x] = {value: PostsData, key: postId}
          $scope.PostsData = Utils.arrayValuesAndKeys(PostsData);
          $scope.status['timeline_empty'] = false;
        } else {
          $scope.status['timeline_empty'] = true;
        };
        $scope.status['loading'] = false;
        $scope.$broadcast('scroll.refreshComplete');

        //@dependencies
        formatOther(PostsData);
        loadPostsImages(PostsData);
        // todo: v2.1 loadComments(PostsData);
      },
      function(error){
        console.log(error)
        $scope.status['loading'] = false;
        $scope.$broadcast('scroll.refreshComplete');
      }
    )
  };

  $scope.PostsImages = {};
  function loadPostsImages(PostsData) {

    angular.forEach(PostsData, function(value, postId){
      $scope.loadingPosts['image'][postId] = true;
      Timeline.getImages($scope.status['uid'], postId).then(
        function(PostImages){
          if(PostImages != null) {
            $scope.PostsImages[postId] = PostImages;
            $ionicSlideBoxDelegate.update();
            $scope.loadingPosts['image'][postId] = false;
          } else {
            $scope.loadingPosts['image'][postId] = null;
          }
        },
        function(error){
          $scope.loadingPosts['image'][postId] = null;
        }
      )
    })
  };

  // additional formatting
  $scope.PostsDataOther = {};
  function formatOther(PostsData) {
    angular.forEach(PostsData, function(value, postId){
      $scope.PostsDataOther[postId] = {
        since: Utils.timeSince(value.timestamp_create)
      };
    });
  };

  $scope.moreOptions = function(postId, uid) {
    // Show the action sheet
    if($scope.AuthData.uid == uid) {
      var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Do something else' },
       ],
       destructiveText: 'Delete',
       titleText: 'Post options',
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
          },
       buttonClicked: function(index) {
         switch(index) {
           case 0:
             //
             window.alert("Do something else")
             break
         }
         return true;
       },
       destructiveButtonClicked: function() {
         deletePost(postId);
         hideSheet();
         return true;
       }
      });

      /**
      $timeout(function() {
       hideSheet();
      }, 2000);
      */
    }
  };

  function deletePost(postId) {
    // A confirm dialog
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete post',
      template: 'Are you sure you want to delete this post?'
    });
    confirmPopup.then(function(res) {
     if(res) {
         Timeline.deletePost($scope.AuthData.uid, postId).then(
           function(success){
             loadTimeline();
           })
       } else {
         console.log('You are not sure');
       }
     }
    );
  };

  $scope.newPost = function() {
    $state.go('submit');
  };

  $scope.goToProfile = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('tab.timeline', {uid: $scope.AuthData.uid});
  };

  $scope.slideHasChanged = function () {
    $ionicSlideBoxDelegate.update();
  };

})

