app.controller('searchController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', '$stateParams', '$filter', function ($scope, $http, ngProgress, $state, $rootScope, $uibModal, $stateParams, $filter) {
    //--Calender functions---------------------------------------
    $scope.format = 'MM-dd-yyyy';
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };
    //----------------------------------------------------------------
    /*$scope.initMap= function(){
        //debugger
        //console.log("I came here in init angular");
        var uluru = {lat: 36.9741, lng: -122.0308};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: uluru,
            mapTypeId: 'roadmap'
        });

        var infoWindow = new google.maps.InfoWindow();

        var marker = new google.maps.Marker({
            position: uluru,
            map: map,
            clickable:true,
        });
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent("hi");
            infoWindow.open(map,this);
        });
        google.maps.event.addListener(map, 'click', function() {
            infoWindow.close();

        });
    }*/

    /*$scope.chkbxs = [{label:"Entire Home", val:false },{label:"Private Room", val:false },{label:"Shared Room", val:false }];
    $scope.$watch( "chkbxs" , function(n,o){
        var trues = $filter("filter")( n , {val:true} );
        //$scope.flag = trues.length;
    }, true );*/

    $scope.dropdown1 = ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6 guests", "7 guests", "8 guests", "9 guests", "10 guests", "11 guests", "12 guests", "13 guests", "14 guests", "15 guests", "16+ guests"];
    $scope.dropdownDefault = $stateParams.guests;

    /*$scope.checkin=$stateParams.checkin;
    $scope.checkout=$stateParams.checkout;*/

    debugger
    console.log($stateParams.location);
    console.log($stateParams.checkout);
    console.log($stateParams.checkin);
    console.log($stateParams.guests);


    $scope.getPropertyData = function () {
        debugger

        var myCenter = new google.maps.LatLng(37.3382, -121.8863);
        // var uluru = {lat: 36.9741, lng: -122.0308};
        var geocoder;
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: myCenter,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infoWindow = new google.maps.InfoWindow();

        var marker = new google.maps.Marker({
            position: myCenter,
            map: map,
            clickable: true,
        });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent("Hi");
            infoWindow.open(map, this);
        });
        google.maps.event.addListener(map, 'click', function () {
            infoWindow.close();
        });

        if ($stateParams.location == undefined && $stateParams.checkout == undefined && $stateParams.checkin == undefined) {
            $http({
                url: "/property/searchAllProperties",
                method: "post",
                data: {

                }
            }).success(function (data) {
                console.log("I m in success of searchAllProperties angular");
                $scope.propertyList = data.value;
            })
        }
        else if ($stateParams.location !== undefined && $stateParams.checkout == undefined && $stateParams.checkin == undefined) {
            var locationarr = $stateParams.location.split(", ");

            console.log("value of :" + locationarr[0]);
            console.log("value of :" + locationarr[1]);
            $http({
                url: "/property/searchbycity",
                method: "post",
                data: {
                    city: locationarr[0],
                    state: locationarr[1]
                }
            }).success(function (data) {
                debugger
                console.log("I m in success of searchbycity angular");
                $scope.propertyList = data.value;
                $scope.addresses = ["676 S 9th Street, San Jose, CA, US", "135 Rio Robles E, San Jose, CA, US"];
                geocoder = new google.maps.Geocoder();
                var infoWindowContent = ["My name is","Nishank Singla"];
                angular.forEach($scope.addresses, function (value, key) {
                    geocoder.geocode({ 'address': $scope.addresses[key] }, function (results, status) {
                        console.log(results);
                        if (status == 'OK') {
                            map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                            marker.addListener('click', function () {
                                infoWindow.setContent(infoWindowContent[key]);
                                 
                                infoWindow.open(map, marker);
                            })
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                })
            })
        }
    };
    $scope.entirehome = false;
    $scope.entireHome = function () {
        $scope.entirehome = true;
        console.log("entire home is selected");
    }
    if ($scope.entirehome == "true") {

    }
}]);