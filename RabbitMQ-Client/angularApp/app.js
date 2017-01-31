var app = angular.module("airbnb", ['ui.router', 'ngProgress', 'ui.bootstrap', 'ui-notification', 'ngFileUpload', 'thatisuday.ng-image-gallery', 'ngAutocomplete']);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'NotificationProvider', 'ngImageGalleryOptsProvider', function($stateProvider, $urlRouterProvider, $locationProvider, NotificationProvider, ngImageGalleryOptsProvider) {

    NotificationProvider.setOptions({
        delay: 2000,
        positionX: 'center',
        positionY: 'top'
    });

    ngImageGalleryOptsProvider.setOpts({
        thumbnails: false,
        inline: false,
        imgBubbles: false,
        bgClose: true,
        bubbles: true,
        imgAnim: 'fadeup',
    });

    $stateProvider
        .state("/", {
            url: '/',
            templateUrl: 'default/default.html',
            controllerUrl: "default/defaultController"
        })
        .state("host", {
            url: '/host',
            templateUrl: 'hostPage/hostpage.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host", {
            url: '/become-a-host',
            templateUrl: 'hostPage/become_a_host.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.category", {
            url: '/category',
            templateUrl: 'hostPage/category.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.location", {
            url: '/location',
            templateUrl: 'hostPage/location.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.bedrooms", {
            url: '/bedrooms',
            templateUrl: 'hostPage/bedrooms.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.photos", {
            url: '/photos',
            templateUrl: 'hostPage/photos.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.description", {
            url: '/description',
            templateUrl: 'hostPage/description.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.calendar", {
            url: '/calendar',
            templateUrl: 'hostPage/hostCalendar.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.choose-pricing-mode", {
            url: '/choose-pricing-mode',
            templateUrl: 'hostPage/choose-pricing-mode.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.bid", {
            url: '/biding',
            templateUrl: 'hostPage/bidPrice.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.price", {
            url: '/price',
            templateUrl: 'hostPage/fixedPrice.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("become-a-host.publish", {
            url: '/publish',
            templateUrl: 'hostPage/readyToPublish.html',
            controllerUrl: "hostPage/hostController"
        })
        .state("searchQuery", {
            url: '/search?location&checkout&checkin&guests',
            templateUrl: 'searchPage/searchPage.html',
            controllerUrl: "searchPage/searchController"
        })
        .state("users", {
            url: '/users',
            templateUrl: 'profile/users.html',
            controllerUrl: "profile/profileController"
        })
        .state("users.edit", {
            url: '/edit',
            templateUrl: 'profile/editprofile.html',
            controllerUrl: "profile/profileController"
        })
        .state("users.edit.media", {
            url: '/media',
            templateUrl: 'profile/photo.html',
            controllerUrl: "profile/profileController"
        })
        .state("users.show", {
            url: '/show',
            templateUrl: 'profile/viewprofile.html',
            controllerUrl: "profile/profileController"
        })
        .state("users.listings", {
            url: '/listings',
            templateUrl: 'listingPages/listing.html',
            controllerUrl: "listingPages/listingController"
        })
        .state("users.listings.propert_requests", {
            url: '/propert_requests',
            templateUrl: 'listingPages/host_property_request.html',
            controllerUrl: "listingPages/listingController"
        })
        .state("individualProperty", {
            url: '/property?id',
            templateUrl: 'propertyPage/IndividualPropertyPage.html',
            controllerUrl: "propertyPage/propertyController"
        })
        .state("users.trips", {
            url: '/trips',
            templateUrl: 'tripsPage/usertrips.html',
            controllerUrl: "tripsPage/tripController"
        })
        .state("users.account", {
            url: '/account',
            templateUrl: 'bill/bill_list.html',
            controllerUrl: "bill/billController"
        })
        .state("users.account.bill", {
            url: '/bill?id',
            templateUrl: 'bill/customer_receipt.html',
            controllerUrl: "bill/billController"
        })
        .state("users.trips.edit", {
            url: '/edit?id',
            templateUrl: 'tripsPage/editTrips.html',
            controllerUrl: "tripsPage/tripController"
        })
        .state("users.trips.preview", {
            url: '/preview?id',
            templateUrl: 'tripsPage/previewTrips.html',
            controllerUrl: "tripsPage/tripController"

        });


    $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode(true);

}]);

app.controller('indexController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', "Notification", function($scope, $http, ngProgress, $state, $rootScope, $uibModal, Notification) {
    $scope.user = {};
    $scope.loginStatus = false;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.search("become-a-host.") > -1) {
            $scope.hideFooter = true;
        } else {
            $scope.hideFooter = false;
        }

    });
    $scope.profileImage_icon = "https://a2.muscache.com/defaults/user_pic-50x50.png?v=2";
    $scope.checkStatus = function() {
        

        $http.get("users/profile")
            .success(function(data) {
                if (data.code === 200) {
                    // $scope.loginStatus = true;
                    $scope.loginStatus = true;
                    $scope.user = data.user;
                    $scope.profileImage_icon = data.user.profile_image;
                    sessionStorage.user = JSON.stringify(data.user);
                } else if (data.error) {
                    $scope.loginStatus = false;
                } else if (data.code === 401) {
                    console.log(data.value);
                }
            })
            .error(function(err) {

            })
    };


    $scope.openSignup = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'signupmodal.html',
            controller: 'signupController',
            windowClass: "signupmodal",
            resolve: {

            }
        });
    };

    $scope.openLogin = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'loginController',
            windowClass: "loginmodal",
            resolve: {

            }
        });
    };

    $scope.logout = function() {
        window.sessionStorage.login_status = "false";
        $http.get("/users/logout")
            .success(function(data) {
                debugger
                if (data.status === "success") {
                    $scope.user = {};
                    $scope.loginStatus = false;
                    delete window.sessionStorage.user;
                    window.location.href = "/";
                } else if (data.error) {
                    Notification.error(data.error);
                }
            })
            .error(function(err) {

            })
    }
}]);

app.controller('signupController', function($scope, $uibModalInstance, $http, $uibModal) {

    //debugger
    $scope.registeralerts = [];
    $scope.showSignupForm = false;
    $scope.registerUser = {};
    $scope.signup = function() {
        //debugger
        $scope.showSignupForm = true;
    }

    $scope.back = function() {
        $scope.showSignupForm = false;
    }

    $scope.closeRegisterAlert = function(index) {
        $scope.registeralerts.splice(index, 1);
    }

    $scope.register = function() {
        debugger
        console.log($scope.registerUser);

        $http.post("/users/register", $scope.registerUser)
            .success(function(data) {
                debugger
                console.log(data);
                if (data.error) {
                    // $scope.error = true;
                    $scope.registeralerts = [{ type: 'danger', msg: data.error }];

                } else if (data.errors) {
                    // $scope.error = true;
                    $scope.alerts = [data.errors.message];

                }
                else if (data.status) {
                    $scope.registeralerts = [{ type: 'success', msg: "Successfully Registered" }];
                    $scope.registerUser = {};
                }
            })
            .error(function(err) {

            })
    };

    $scope.openLogin = function() {
        $uibModalInstance.dismiss('close');
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'loginController',
            windowClass: "loginmodal",
            resolve: {

            }
        });

    }

});
app.controller('loginController', function($scope, $uibModalInstance, $http, $uibModal) {
    //debugger

    $scope.loginalerts = [];

    $scope.closeLoginAlert = function(index) {
        $scope.loginalerts.splice(index, 1);
    }

    $scope.login = function() {
        //debugger
        if ($scope.user.username === "admin@gmail.com") {
            window.location.href = "/admin.html"
            // window.location.href("/admin.html");
        } else {
            $http.post("/users/login", $scope.user)
                .success(function(data) {
                    //debugger
                    if (data.status === "success") {
                        $uibModalInstance.dismiss('close');
                        window.sessionStorage.login_status = "true";
                        // window.sessionStorage.user_info = JSON.stringify(data.user);
                        window.location.reload();
                        // $scope.$parent.loginStatus = true;
                        // $state.go('/admin');
                    } else {
                        $scope.loginalerts = [{ type: 'danger', msg: data.error }];
                    }
                })
                .error(function(err) {

                })
        }
    }

    $scope.openSignup = function() {
        $uibModalInstance.dismiss('close');
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'signupmodal.html',
            controller: 'signupController',
            windowClass: "signupmodal",
            resolve: {

            }
        });
    }



});