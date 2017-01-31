app.controller('listingController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', 'Upload', 'Notification', function($scope, $http, ngProgress, $state, $rootScope, $uibModal, Upload, Notification) {
    if ($state.current.name === "users.listings") {
        debugger
        $http.get("/property/searchbyuserid")
            .success(function(data) {
                debugger
                if (data.code === 200) {
                    $scope.listed_property = [];
                    $scope.inProgress_property = [];
                    angular.forEach(data.value, function(value, key) {
                        if (value.published === "true") {
                            $scope.listed_property.push(value);
                        } else {
                            
                            if (value.published === "step1") {
                                value.dynamic = 34;
                            }
                            if (value.published === "step2") {
                                value.dynamic = 67;
                            }
                            if (value.published === "step3") {
                                value.dynamic = 100;
                            }
                            $scope.inProgress_property.push(value);
                        }
                    });
                    // data.mongoval data.value
                }
            })
            .error(function(err) {

            })
    }
    else if ($state.current.name === "users.listings.propert_requests") {
        $http.get("/usertrips/getTripsByHostId")
            .success(function(data) {
                debugger
                if (data.code === 200) {
                    debugger
                    $scope.propertyList = data.data;
                    $scope.acceptedPropertyList = [];
                    $scope.requestedPropertyList = [];
                    // $scope.listed_property = [];
                    angular.forEach($scope.propertyList, function(value, key) {
                        if ($scope.propertyList[key].tripstatus === "approved") {
                            $scope.acceptedPropertyList.push($scope.propertyList[key]);

                        } else if ($scope.propertyList[key].tripstatus === "pending") {
                            $scope.requestedPropertyList.push($scope.propertyList[key]);
                        }
                    });
                    // // data.mongoval data.value
                }
            })
            .error(function(err) {

            })
    }

    $scope.acceptPropertyRequest = function(tripid) {
        
        $http.post("/host/approvetrips", { "tripid": tripid })
        .success(function(data) {
            if (data.status === "success") {
                // Notification.success("Succesfully approved user request");
                // $state.go("users.listings.propert_requests");
                window.location.reload();
            }else{
                Notification.error(data.error);
            }
        })
        .error(function(err) {
            Notification.error("Error unknown. Please try again.");
        })
    }

    $scope.declinePropertyRequest = function(tripid) {
        $http.post("/host/rejecttrips", { "tripid": tripid })
        .success(function(data) {
            if (data.status === "success") {
                // Notification.success("Succesfully rejected user request");
                // $state.go("users.listings.propert_requests");
                window.location.reload();
            }else{
                Notification.error(data.error);
                
            }
        })
        .error(function(err) {
            Notification.error("Error unknown. Please try again.");
        })
    };

    $scope.finish_listing = function(index){
        sessionStorage.inProgress_property = JSON.stringify($scope.inProgress_property[index]);
        $state.go("become-a-host");
    }


}]);