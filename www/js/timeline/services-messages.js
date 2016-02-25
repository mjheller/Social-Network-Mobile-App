angular.module('starter.services-messages', [])

    .factory('Messages', function($q, Profile, Utils, Codes) {
        var self = this;

        self.getConversations = function(uid){
            var messages = [];
            var qGet = $q.defer();
            var ref = new Firebase(FBURL+'/messages_meta/'+uid)
            ref.on("value", function(myConversations) {
                myConversations.forEach(function(snapshot){
                    var myMessages = snapshot.val();
                    messages.push(myMessages);
                    //qGet.resolve(myMessages.val());
                });
                qGet.resolve(messages);
            });
            return qGet.promise;
        };

        self.getMessages = function(uid, friendID){
            var messages = [];
            var qGet = $q.defer();
            var ref = new Firebase(FBURL+'/messages_meta/'+uid + '/' + friendID);
            ref.on("value", function(messages) {
                //myConversations.forEach(function(snapshot){
                //    var myMessages = snapshot.val();
                //    messages.push(myMessages);
                //    //qGet.resolve(myMessages.val());
                //});
                qGet.resolve(messages.val());
            });
            return qGet.promise;
        };

        self.sendMessage = function(uid, friendID, UserData, FormData) {      // new
            var qAdd = $q.defer();
            var ref = new Firebase(FBURL);
            var messageId = generateMessageId();

            Utils.showMessage('Sending message...');

            var paths = {};
            //paths['/messages/' + postId] = FormData;
            paths['/messages_meta/' + uid + '/' + friendID + '/UserData'] = UserData;
            paths['/messages_meta/' + friendID + '/' + uid + '/UserData'] = UserData;
            paths['/messages_meta/' + uid + '/' + friendID + '/' + messageId] = FormData;
            paths['/messages_meta/' + friendID + '/' + uid + '/' + messageId] = FormData;


            var onComplete = function(error) {
                if (error) {
                    Codes.handleError(error);
                    qAdd.reject(error);
                } else {
                    Utils.showMessage('Message Sent', 1500);
                    qAdd.resolve("POST_ADD_SUCCESS");
                }
            }
            ref.update(paths, onComplete);
            return qAdd.promise;
        };


        function generateMessageId() {
            var d = new Date();

            var wordString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var letterPart = "";
            for (var i=0; i<10; i++) {
                letterPart = letterPart + wordString[Math.floor(26*Math.random())]
            };

            var fyear = d.getFullYear();
            var fmonth = d.getMonth()+1;
            var fday = d.getDate();
            var fhour = d.getHours();
            var fminute = d.getMinutes();

            fmonth = fmonth < 10 ? '0'+fmonth : fmonth;
            fday = fday < 10 ? '0'+fday : fday;
            fhour = fhour < 10 ? '0'+fhour : fhour;
            fminute = fminute < 10 ? '0'+fminute : fminute;

            var ftime = d.getTime();

            d = d.getTime();
            d = d.toString();

            return "M" + fyear + fmonth + fday + fhour + fminute + letterPart;
        };

        return self;
    })


    .service('recipientInfo', function($stateParams,$http){
        var getID = function($stateParams) {
            var recipID = $http.get($stateParams.recipientID);
            return recipientID
        };
        var getStateParams = function() {
            return $stateParams;
        };

        return {
            getRecipientID: getID,
            getStateParams: getStateParams,
        };
    })