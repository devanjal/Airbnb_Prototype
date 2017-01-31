app.controller('tripController', ['$scope', '$http', 'ngProgress', '$state', '$uibModal','Notification', function ($scope, $http, ngProgress, $state, $uibModal,Notification) {

    if($state.current.name==="users.trips"){
        $http.get("/usertrips").success(function (response) {
            $scope.pendingtrips = [];
            $scope.usertrips = [];
            if(response.code == 200) {
                debugger
                var resArray = response.value;
                for(var i=0; i<resArray.length; i++) {
                    if(resArray[i].tripstatus == "pending") {
                        $scope.pendingtrips.push(resArray[i]);
                    }else if(resArray[i].tripstatus == "approved"){
                        $scope.usertrips.push(resArray[i]);
                    }
                }
            }else if (response.code == 401) {

            }
        }).error(function (err) {

        });
    }
    else if($state.current.name==="users.trips.edit"){
        console.log($state.params.id);
        $http.get("/usertrips/getTripByUserId/"+$state.params.id)
            .success(function(data){
                debugger
                if(data.code == 200){
                    console.log(JSON.stringify(data));
                    $scope.editProperty = data.data[0];
                    $scope.checkinDate = new Date($scope.editProperty.fromdate.split("T")[0]);
                    $scope.checkoutDate = new Date($scope.editProperty.todate.split("T")[0]);
                    $scope.addressString = data.data[0].address +", " + data.data[0].city + ", " + data.data[0].state + ", " + data.data[0].country;
                    sessionStorage.editProperty = JSON.stringify($scope.editProperty);
                    var geocoder = new google.maps.Geocoder();

                    var infoWindow = new google.maps.InfoWindow();

                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'address': $scope.addressString }, function (results, status) {
                        console.log(results);
                        if (status == 'OK') {
                            var map = new google.maps.Map(document.getElementById('map1'), {
                                zoom: 12,
                                center:results[0].geometry.location,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                            });
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                            marker.addListener('click', function () {
                                infoWindow.setContent($scope.addressString);
                                infoWindow.open(map, marker);
                            });
                            google.maps.event.addListener(map, 'click', function () {
                                infoWindow.close();
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                    $state.go("users.trips.edit");
                }else if(data.code == 401){

                }

            })
            .error(function (err) {

            });
    }else if($state.current.name==="users.trips.preview"){
        console.log($state.params.id);
        $http.get("/usertrips/getTripByUserId/"+$state.params.id)
            .success(function(data){
                debugger
                if(data.code == 200){
                    console.log(JSON.stringify(data));
                    $scope.property = data.data[0];
                    $scope.addressString = data.data[0].address +", " + data.data[0].city + ", " + data.data[0].state + ", " + data.data[0].country;
                    sessionStorage.property = JSON.stringify($scope.property);

                    var geocoder = new google.maps.Geocoder();

                    var infoWindow = new google.maps.InfoWindow();

                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'address': $scope.addressString }, function (results, status) {
                        console.log(results);
                        if (status == 'OK') {
                            var map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 12,
                                center:results[0].geometry.location,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                            });
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                            marker.addListener('click', function () {
                                infoWindow.setContent($scope.addressString);
                                infoWindow.open(map, marker);
                            });
                            google.maps.event.addListener(map, 'click', function () {
                                infoWindow.close();
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                    $state.go("users.trips.preview");

                }else if(data.code == 401){

                }

            })
            .error(function (err) {

            });
    }

    $scope.updateTrip = function () {
        var obj = {};
        debugger
        $scope.editProperty.todate = $scope.checkoutDate;
        $scope.editProperty.fromdate = $scope.checkinDate;
        $http.post("/usertrips/edit", $scope.editProperty)
            .success(function (data) {
                debugger
                 if(data.code === 200){
                     Notification.success("Successfully updated your trip.");
                     $state.go("users.trips");
                 }
            }).error(function (err) {

            });
    };
    
    $scope.cancelTrip = function () {
        $http.post("/usertrips/cancelTrip", this.trip)
            .success(function (data) {
                if(data.code === 200){
                    Notification.success("Successfully cancelled your trip.");
                    $state.go("users.trips");
                }
            })
            .error(function (err) {

            })
    };

    $scope.format='MM-dd-yyyy'
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };


    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    
}]);
