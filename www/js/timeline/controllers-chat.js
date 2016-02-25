angular.module('starter.controllers-chat', [])

.controller('ChatCtrl', function($scope, Chats, Utils, Auth, Messages) {


var chats = [];
  Messages.getConversations(Auth.AuthData.uid).then(function(response){
    response.forEach(function(data){
      //console.log(data);
      chats.push(data);
    })
    $scope.conversations = chats;
    console.log($scope.conversations);
  });


  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})




