angular.module('starter.directives', [])

.directive('postImages', function() {
  return {
    templateUrl: 'templates/directives/post-images.html'
  };
})

    .directive('scrollBottom', function () {
      return {
        scope: {
          schrollBottom: "="
        },
        link: function (scope, element) {
          scope.$watchCollection('schrollBottom', function (newValue) {
            if (newValue)
            {
              $(element).scrollTop($(element)[0].scrollHeight);
            }
          });
        }
      }
    })