app.controller('propertyController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', '$stateParams','Notification', function ($scope, $http, ngProgress, $state, $rootScope, $uibModal, $stateParams,Notification) {

    $scope.methods = {};
    $scope.checkin;
    $scope.checkout;
    $scope.nights = 1;
    $scope.guests=["1 guest"];
    $scope.selected_guest = $scope.guests[0];
// availability_from
// :
// "2016-12-02T08:00:00.000Z"
// availability_to
// :
// "2016-12-09T08:00:00.000Z"

    $scope.openGallery = function () {
        //console.log("I came in open gallery function()");
        $scope.methods.open();
    };

    // Similar to above function
    $scope.closeGallery = function () {
        $scope.methods.close();
    };

    $scope.nextImg = function () {
        $scope.methods.next();
    };

    $scope.prevImg = function () {
        $scope.methods.prev();
    };
    //rating functions
    $scope.rate = 5;
    $scope.max = 5;
    $scope.isReadonly = true;
    //calender functions
    $scope.format = 'MM/dd/yyyy';
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        showWeeks: true
    };

    // var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

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

    $scope.dropdown1 = ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6 guests", "7 guests", "8 guests", "9 guests", "10 guests", "11 guests", "12 guests", "13 guests", "14 guests", "15 guests", "16+ guests"];
    $scope.dropdownDefault = $scope.dropdown1[0];

    // debugger
    // console.log($stateParams.id);
    $scope.getCheckInDate = function(check_in_date){
        debugger
        if($scope.checkout){
            var oneDay = 24*60*60*1000;
            $scope.nights = Math.round(Math.abs(($scope.checkout.getTime() - $scope.checkin.getTime())/(oneDay)));
        }
        console.log(check_in_date);
    };
    $scope.getCheckOutDate = function(check_out_date){
        debugger
        if($scope.checkin){
            var oneDay = 24*60*60*1000;
            $scope.nights = Math.round(Math.abs(($scope.checkout.getTime() - $scope.checkin.getTime())/(oneDay)));
        }
        console.log(check_out_date);
    };
    $scope.fetchData = function () {
        debugger
        $http({
            url: "/property/searchbypropertyid",
            method: "post",
            data: {
                id: $stateParams.id
            }
        }).success(function (data) {
            debugger
            
            $scope.propertyDetails = data.value[0];
            console.log(($scope.propertyDetails.availability_to).split("T"));
            $scope.dateOptions.maxDate = new Date($scope.propertyDetails.availability_to);
            $scope.dateOptions.minDate = new Date(($scope.propertyDetails.availability_from));
            for(var i = 2;i<=$scope.propertyDetails.quantity;i++){
                $scope.guests.push(i+" guest");
            }
            
            var images = data.value[0].images;
            var tmpObj = {};
            var tmpImgArray=[];
            for (var i = 1; i < images.length; i++) {
                tmpObj["url"] = images[i];
                // tmpObj["title"] = i;
                tmpImgArray.push(tmpObj);
                tmpObj = {};
            }
            $scope.images = tmpImgArray;
            // $scope.images = [
            //     {
            //         url: temp[0]

            //     },
            //     {
            //         url: temp[1]
            //     }
            // ];
        });
    };

    $scope.request_booking = function(){
        $scope.booking = {};
        $scope.booking.propertyid = $scope.propertyDetails.propertyid;
        $scope.booking.hostid = $scope.propertyDetails.hostid;
        $scope.booking.quantity = parseInt($scope.selected_guest.split(" ")[0]);
        $scope.booking.fromdate  = $scope.checkin;
        $scope.booking.todate = $scope.checkout;

        $http.post("/usertrips/create",$scope.booking)
        .success(function(data){
            debugger
            if(data.code === 200){
                Notification.success("Your request has been placed.");
                $state.go("users.trips");
            }else if(data.code === 401){
                Notification.error(data.value);
            }
        })
        .error(function(err){
            
        })
    }
    
}]);



