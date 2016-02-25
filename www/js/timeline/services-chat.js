angular.module('starter.services-chat', [])

.factory('Chats', function(Messages, Auth) {

  var self = this;


  var chats = Messages.getMessages(Auth.AuthData.uid);


    //// Some fake testing data
    //var chats = [{
    //  id: 0,
    //  name: 'Ben Sparrow',
    //  lastText: 'You on your way?',
    //  face: 'img/ben.png'
    //}, {
    //  id: 1,
    //  name: 'Max Lynx',
    //  lastText: 'Hey, it\'s me',
    //  face: 'img/max.png'
    //}, {
    //  id: 2,
    //  name: 'Adam Bradleyson',
    //  lastText: 'I should buy a boat',
    //  face: 'img/adam.jpg'
    //}, {
    //  id: 3,
    //  name: 'Perry Governor',
    //  lastText: 'Look at my mukluks!',
    //  face: 'img/perry.png'
    //}, {
    //  id: 4,
    //  name: 'Mike Harrington',
    //  lastText: 'This is wicked good ice cream.',
    //  face: 'img/mike.png'
    //}];



  this.remove = function(chat) {
    chats.splice(chats.indexOf(chat), 1);
  };

  this.get = function(chatId) {
    for (var i = 0; i < chats.length; i++) {
      if (chats[i].id === parseInt(chatId)) {
        return chats[i];
      }
    }
    return null;
  };

  return {
    all: function () {
      return chats;
    }
  }
})
