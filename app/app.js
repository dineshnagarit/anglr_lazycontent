'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.version',  
  'ui.router',
  'ui.bootstrap',
  'infinite-scroll'
]);

app.config(function($stateProvider, $urlRouterProvider){
 
  $urlRouterProvider.otherwise("/route1")
  $stateProvider
   
   .state('route1', { 
        url: "/route1",
        templateUrl: "views/route1.html"
    })

	 .state('route1.list', { 
	      url: "/list",
	      templateUrl: "views/route1.list.html"
	  })
      
    .state('route2', { 
        url: "/route2",
        templateUrl: "views/route2.html"
    })
    
    .state('route2.list', { 
          url: "/list",
          templateUrl: "views/route2.list.html"
       
     })

    .state('infinite',{
          url: "/list",
          templateUrl: "views/lazycontent.html"
    })
})


app.controller('SidebarController', function($scope) {
   
    $scope.state = false;
    $scope.toggleState = function() {
        $scope.state = !$scope.state;
    };
    
})

app.directive('sidebarDirective', function() {
    return {
        link : function(scope, element, attr) {
            scope.$watch(attr.sidebarDirective, function(newVal) {
                  
                  if(newVal){
                    element.addClass('show'); 
                    return;
                  }
                  element.removeClass('show');
            });
        }
    };
});  

// Reddit constructor function to encapsulate HTTP and pagination logic
app.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    console.log('getting data',url);
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
})