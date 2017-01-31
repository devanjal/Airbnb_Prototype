
app.controller('defaultController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', function ($scope, $http, ngProgress, $state, $rootScope, $uibModal) {
    $scope.format='MM/dd/yyyy';
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


    $scope.dropdown1=["1 guest","2 guests","3 guests","4 guests","5 guests","6 guests","7 guests","8 guests","9 guests","10 guests","11 guests","12 guests","13 guests","14 guests","15 guests","16+ guests"];
    $scope.guests=$scope.dropdown1[0];

    $scope.result2 = '';
    $scope.options2 = {
        country: 'us',
        state:'ca',
        types: '(cities)'
    };    $scope.details2 = '';
}]);