angular.module('starter.controllers-feed', ['ionic'])

    .controller('FeedCtrl', function($scope, $state , $stateParams,
                                         $ionicSlideBoxDelegate, $ionicPopup, $ionicActionSheet, $ionicHistory,
                                         Auth, Timeline, Utils, Profile, Topics, currentTopic) {

        $scope.topics = Topics.all();
        //$scope.posts = Timeline.getFeed();
        //$scope.posts = loadFeed();
        //console.log($scope.posts) //need to unchain and unwrap the promise


        $scope.status = {
            loading: true,
            loadingProfile: false,
        };
        $scope.AuthData = Auth.AuthData;
        $scope.loadingPosts = {
            'image': {},
        };

        $scope.$on('$locationChangeSuccess', function(event) {
            $scope.topic = currentTopic.getStateParams().topic;
            console.log($scope.topic);

        });

        // used to avoid sticky header
        $scope.$on('$ionicView.leave', function(){
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        $scope.$on('$ionicView.enter', function(){
            loadProfileData()

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


        // Profile data
        // ---------------
        function loadProfileData(){
            // check if in cash
            if(Profile.ProfileData.hasOwnProperty('meta')){
                $scope.ProfileData = Profile.ProfileData;
                $scope.location = $scope.ProfileData.location;
            } else {
                // otherwise load (note: AuthData.uid is resolved)
                Profile.get(Auth.AuthData.uid).then(
                    function(ProfileData){
                        //console.log(ProfileData);
                        $scope.ProfileData = ProfileData;
                        $scope.location = $scope.ProfileData.location;
                    },
                    function(error){
                        console.log(error);
                        $scope.ProfileData = {};
                        Utils.showMessage('Oops... profile data not loaded', 1500)
                    }
                );
            };

        };

        $scope.topicMatcher = function(topicFilter) {
            return function(post) {
                return post.value.meta.topic === $scope.topic;
            }
        };

        $scope.locationMatcher = function(locationFilter){
            return function(location){
                return post.value.meta.location === $scope.location;
            }
        };

        $scope.doRefresh = function() {
            // do not toggle loadingmode when just refresh
            loadFeed();
        };

        function reLoad() {

            $scope.posts = {};
            $scope.status['loading'] = true; // toggle loading mode when enter
            loadFeed();

        };


        function loadFeed() {
            Timeline.getFeed().then(
                function(posts){
                    if(posts != null) {
                        // convert to array for sorting in ng-repeat without filters
                        // returns array with array[x] = {value: PostsData, key: postId}
                        $scope.posts = Utils.arrayValuesAndKeys(posts);
                        console.log($scope.posts);
                    //    $scope.status['feed_empty'] = false;
                    //} else {
                    //    $scope.status['feed_empty'] = true;
                    };
                    //$scope.status['loading'] = false;
                    $scope.$broadcast('scroll.refreshComplete');

                    //@dependencies
                    formatOther(posts);
                    //loadPostsImages(posts);
                    // todo: v2.1 loadComments(PostsData);
                },
                function(error){
                    console.log(error)
                    //$scope.status['loading'] = false;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            )
        };

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

        // additional formatting
        $scope.PostsDataOther = {};
        function formatOther(PostsData) {
            angular.forEach(PostsData, function(value, postId){
                $scope.PostsDataOther[postId] = {
                    since: Utils.timeSince(value.timestamp_create)
                };
            });
        };


        $scope.newPost = function() {
            $state.go('submit', {topic: $scope.topic});
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