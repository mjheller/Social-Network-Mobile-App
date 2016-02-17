angular.module('starter.services-followers', [])



.factory('Followers', function($q, Profile) {
    var self = this;
    
    self.FollowingList = {};
    self.FollowingProfiles = {};
    
    self.resetFollowing = function() {
        self.FollowingList = {};
        self.FollowingProfiles = {};
    };
    
    /**
     * This function retrieves the list of followers first, and then iteratively
     * fills the content of FollowingProfiles (with displayName, username, profilePicture)
     * You can change the promise to wait before all data has been retrieved instead
     * 
     * You can also copy-paste this sample code to retrieve the list of others 
     * that follow the user (followedBy)
     */ 
    //
    // *Note1*
    // Iteratively fill the profiles
    //
    // If you wish to wait for all profiles to be loaded, then 
    // add qRefresh.resolve() in this part of the code. 
    //
    // A great explanation on how to deal with an async forEach loop 
    // can be found in this thread: http://stackoverflow.com/a/21315112/4262057
    //
    self.refreshFollowing = function(uid) {
        var qRefresh = $q.defer();
        getList("following", uid).then(
            function(Following){
                //
                self.FollowingList = Following;
                qRefresh.resolve(); // see *Note1*
                fillFollowingProfiles(Following);
            }, function(error){
                //
                qRefresh.reject(error);
            }
        );
        function fillFollowingProfiles(Following) {
            angular.forEach(Following, function(value, uid) {
                Profile.get(uid).then(
                    function(ProfileData){
                        self.FollowingProfiles[uid] = ProfileData;
                    }, function(error){
                        // skip
                    }
                )
            })
        };
        return qRefresh.promise;
    };
    
    /**
     * Generic wrapper to retrieve list of followers and or followed by
     * targetNode: following and followedBy
     */
    function getList(targetNode, uid) {
        var qGet = $q.defer();
        var targetRef  = new Firebase(FBURL + "/" + targetNode + "/" + uid);
        targetRef.on("value", function(snapshot) {
            self.FollowingList = snapshot.val(); //gv
            qGet.resolve(snapshot.val());
            
        }, function (error) {
            qGet.reject(error);
        });
        return qGet.promise;
    };
    
    
    // following
    // followedBy
    self.addFollower = function(uid, followerUserName) {
        var qAdd = $q.defer();
        var ref = new Firebase(FBURL);
        
        // 1
        checkExistanceUserName(followerUserName).then(
            function(fid){
                // 2
                var paths = {};
                paths['/following/' + uid + "/" + fid] = true;
                paths['/followedBy/' + fid + "/" + uid] = true;
                
                var onComplete = function(error) {
                    if (error) {
                        qAdd.reject(error);
                    } else {
                        qAdd.resolve("ADD_FOLLOWER_SUCCESS");
                    }
                }
                ref.update(paths, onComplete);
            }, function(error){
                // e1
                qAdd.reject(error);
            }
        );
        return qAdd.promise;
    };
    
    // following
    // followedBy
    self.stopFollowing = function(uid, fid) {
        var qStop = $q.defer();
        var ref = new Firebase(FBURL);
        
        var paths = {};
        paths['/following/' + uid + "/" + fid] = null;
        paths['/followedBy/' + fid + "/" + uid] = null;
        
        var onComplete = function(error) {
            if (error) {
                qStop.reject(error);
            } else {
                qStop.resolve("REMOVE_FOLLOWER_SUCCESS");
            }
        }
        ref.update(paths, onComplete);
        return qStop.promise;
    };
    
    /**
     * Checks whether username exists
     * returns 'uid'
     */
    function checkExistanceUserName(username) {
        var qCheck = $q.defer();
        var usernameRef  = new Firebase(FBURL + "/usernames/" + username);
        
        usernameRef.once('value', function(snapshot) {
            var uid = snapshot.val();
            if(uid != null && uid != undefined) {
                qCheck.resolve(uid); // return uid of username
            } else {
                qCheck.reject({code: "USERNAME_NONEXIST"}); 
            }
        });
        return qCheck.promise;
    };
    
    
    return self;
})