angular.module('starter.controllers-feed', ['ionic'])

    .controller('FeedCtrl', function($scope, $state , $stateParams,
                                         $ionicSlideBoxDelegate, $ionicPopup, $ionicActionSheet, $ionicHistory,
                                         Auth, Timeline, Utils, Profile, Topics, currentTopic) {

        $scope.topics = Topics.all();
        $scope.posts = Timeline.getFeed();
        //console.log($scope.posts)
        //$scope.topic = currentTopic.getStateParams().topic;
        //console.log($scope.topic);

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
            //console.log($location.url());
            //console.log($stateParams);
        });

        // used to avoid sticky header
        $scope.$on('$ionicView.leave', function(){
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        });

        $scope.$on('$ionicView.enter', function(){
            if($stateParams.uid != undefined && $stateParams.uid != null && $stateParams.uid != "") {
                // view the timeline of user
                $scope.status['uid'] = $stateParams.uid;
                //reLoad();

            } else {
                // otherwise load users profile
                if($scope.AuthData.hasOwnProperty('uid')){
                    $scope.status['uid'] = $scope.AuthData.uid;
                    //reLoad();
                } else {
                    $state.go('tab.account');
                }

            };
        });

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
                        $scope.status['feed_empty'] = false;
                    } else {
                        $scope.status['feed_empty'] = true;
                    };
                    $scope.status['loading'] = false;
                    $scope.$broadcast('scroll.refreshComplete');

                    //@dependencies
                    formatOther(posts);
                    loadPostsImages(posts);
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