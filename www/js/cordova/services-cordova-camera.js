angular.module('starter.services-cordova-camera', [])

.factory('CordovaCamera', function($q, $cordovaCamera) {
    var self = this;
    
    //
    // generic function for retrieving a base64 imagedata string
    self.newImage = function(sourceTypeIndex, optTargetSize) {
        
        var q = $q.defer();
        
        var targetSizeTarget = 800;
        if(optTargetSize != undefined && optTargetSize != "") {
            targetSizeTarget = optTargetSize;
        };
        
        var sourceType;
        switch(sourceTypeIndex) {
            case 0:
                //
                sourceType = Camera.PictureSourceType.CAMERA;
                break
            case 1:
                //
                sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                break
        };
        
        var options = {
            quality:            100,
		    destinationType :   Camera.DestinationType.DATA_URL,
		    sourceType :        sourceType, 
		    allowEdit :         true,
		    targetWidth:        targetSizeTarget,
            targetHeight:       targetSizeTarget,
		    encodingType:       Camera.EncodingType.JPEG,
		    popoverOptions:     CameraPopoverOptions,
		    saveToPhotoAlbum:   false
	    };
	    
        $cordovaCamera.getPicture(options).then(
        function(imageData) {
            q.resolve("data:image/jpeg;base64," + imageData);
        }, 
        function(error) {
            q.reject(error);
        });
        return q.promise;
    };

    //
    // mock used to test adding a new image on desktop
    self.newImageTest = function(sourceType, optTargetSize) {
        var q = $q.defer();
        var tempImg = "data:image/jpeg;base64,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";
        tempImg = "img/adam.jpg";
        q.resolve(tempImg);
        return q.promise;
    };
    
    return self;
    
})