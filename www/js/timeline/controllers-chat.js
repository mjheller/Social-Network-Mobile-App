angular.module('starter.controllers-chat', [])

.controller('ChatCtrl', function($scope, Chats, Utils, Auth, Messages, $ionicHistory) {

  $scope.$on('$ionicView.enter', function(){
    var chats = [];
    Messages.getConversations(Auth.AuthData.uid).then(function(response){
      response.forEach(function(data){
        //console.log(data);
        chats.push(data);
      })
      $scope.conversations = chats;

    });

  });



  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})




