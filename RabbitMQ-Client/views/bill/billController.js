app.controller('billController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', 'Upload', 'Notification', function ($scope, $http, ngProgress, $state, $rootScope, $uibModal, Upload, Notification) {
    debugger
    if ($state.current.name === "users.account") {
        $http.get("/bill/getBillByHid")
            .success(function (data) {
                debugger
                if (data.status === "success") {
                    console.log(data.result);
                    $scope.billDetails = data.result;
                } else if (data.status === "error") {
                    Notification.error(data.error);
                }
            })
            .error(function (err) {

            })
    }
    if ($state.current.name === "users.account.bill") {
        $http.post("/bill/getByBillId",{bill_id:$state.params.id})
            .success(function (data) {
                debugger
                if (data.status === "success") {
                    console.log(data.result[0]);
                    $scope.billData = data.result[0];
                } else if (data.status === "error") {
                    Notification.error(data.error);
                }
            })
            .error(function (err) {

            })
    }
}]);
