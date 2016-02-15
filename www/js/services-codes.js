angular.module('starter.services-codes', [])


/**
 * Handles error codes from Firebase and e.g.
 */
.factory('Codes', function(Utils, $q) {
  var self = this;

  self.handleError = function(error) {
    Utils.showMessage(self.getErrorMessage(error), 1500);
  };

  self.getErrorMessage = function(error) {
    var updateMessage = "";
    console.log(error)
    if (error.hasOwnProperty('code')){
      switch(error.code) {
        case 'INVALID_USER':
          //
          updateMessage = "User does not exist... Sign up!"
          // perhaps an automatic redirect
          break
        case 'INVALID_EMAIL':
          //
          updateMessage = "Invalid E-mail. Try again"
          break
        case 'INVALID_PASSWORD':
          //
          updateMessage = "Incorrect password"
          break
        case 'INVALID_INPUT':
          //
          updateMessage = "Invalid E-mail or password. Try again"
          break
        case 'EMAIL_TAKEN':
          //
          updateMessage = "E-mail is already taken. Forgot password? Reset it"
          break
        case 'USERNAME_TAKEN':
          //
          updateMessage = "Username is already taken. Try again"
          break
        case 'USERNAME_NONEXIST':
          //
          updateMessage = "User not found. Check your spelling"
          break
        case 'PROFILE_NOT_SET':
          //
          updateMessage = "Please provide an username and display name"
          break
        case 'POST_NEW_CHAR_EXCEEDED':
          //
          updateMessage = "Your post can have max. " + POST_MAX_CHAR + " characters"
          break
        default:
          //
          updateMessage = "Oops. Something went wrong..."
          break
      }
    } else {
      updateMessage = "Oops. Something went wrong..."
    }
    return updateMessage;
  };


  /**
   * Generic function to validate input
   */
  self.validateInput = function(inputValue, inputType) {
    var qVal = $q.defer();
    switch (inputValue) {
      case undefined:
        handleValidation("INPUT_UNDEFINED", false)
        break
      case null:
        handleValidation("INPUT_NULL", false)
        break
      case "":
        handleValidation("INPUT_NULL", false)
        break
      default:
        handleValidation("INPUT_VALID", true)
        break
    }
    function handleValidation(code, pass){
      if(pass){
        qVal.resolve(code);
      } else {
        qVal.reject(code);
      }
    };
    return qVal.promise;
  };

  return self;
})
