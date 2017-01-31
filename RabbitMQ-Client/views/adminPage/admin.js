/**
 * Created by varsha on 11/28/2016.
 */
var app = angular.module('adminDashboardApp', ["chart.js"]);
app.controller('adminDashboardController', function ($scope, $http, $window) {

    $http({
        method : "POST",
        url : "/admin/gettoprevenue",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {type:'property'}
    }).then(function mySucces(response) {
        labels = [];
        data = [];
        //$window.alert(JSON.stringify(response.data))

        for(item in response.data.value)
        {

            labels.push(response.data.value[item].title);
            data.push(response.data.value[item].netrevenue);

        }
        //$window.alert(labels)

        //$window.alert(data)

        $scope.series = ['property top revenue'];
        $scope.labels = labels;
        $scope.data = [data];
    }, function myError(response) {
        // $scope.myWelcome = response.statusText;
    });

    $http({
        method : "POST",
        url : "/admin/gettoprevenue",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {type:'city'}
    }).then(function mySucces(response) {
        clabels = [];
        cdata = [];

        for(item in response.data.value)
        {

            clabels.push(response.data.value[item].city);
            cdata.push(response.data.value[item].netrevenue);

        }

        $scope.cityseries = ['city top revenue'];
        $scope.citylabels = clabels;
        $scope.citydata = [cdata];
    }, function myError(response) {
        // $scope.myWelcome = response.statusText;
    });

    $http({
        method : "POST",
        url : "/admin/gettoprevenue",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {type:'host'}
    }).then(function mySucces(response) {
        hlabels = [];
        hdata = [];
        //$window.alert('host ' + JSON.stringify(response.data))

        for(item in response.data.value)
        {
            hlabels.push(response.data.value[item].firstname + "  "+response.data.value[item].lastname);
            hdata.push(response.data.value[item].netrevenue);
        }

        $scope.hostseries = ['host top revenue'];
        $scope.hostlabels = hlabels;
        $scope.hostdata = [hdata];
    }, function myError(response) {
        // $scope.myWelcome = response.statusText;
    });

    $scope.hostDetails = [
        {
            firstname : "test",
            lastname : "test",
            email : "test"

        }
    ];

    $scope.hostsearchresults = [];
    // $scope.searchdate = new Date();

    $scope.visithostpage = function(id)
    {
        $window.alert('should go to host id page ' + id);
    }
    $scope.searchtext = '';
    $scope.billsearchresults = [];
    $scope.visitbillpage = function(id)
    {
        $window.alert(id)
    }
    $scope.searchbillbydate = function()
    {
        $http({
            method : "POST",
            url : "/bill/searchByDate",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {date:$scope.searchdate}
        }).then(function mySucces(response) {
           // $window.alert(JSON.stringify(response.data));
            $scope.billsearchresults = response.data.result;
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });
        //$window.alert(' searchbillbydate search bill by date test ' +  $scope.searchdate);
    }
    $scope.searchhost = function()
    {
        $http({
            method : "POST",
            url : "/host/gethostbyarea",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {location:$scope.searchtext}
        }).then(function mySucces(response) {
            $scope.hostsearchresults = response.data;
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
    });

        //$window.alert('should go to host id page ' + $scope.searchtext);

    }
    $scope.options = {
        responsive: false,
        maintainAspectRatio: false,
        barDatasetSpacing: 1,
        barShowStroke: true,
        barStrokeWidth : 2,
        barValueSpacing : 5
    };
    $scope.labels = [];
    $scope.series = [];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.citylabels = [];
    $scope.cityseries = [];

    $scope.citydata = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.hostlabels = [];
    $scope.hostseries = [];

    $scope.hostdata = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.adminairbnb = function()
    {
        //$window.alert("adminairbnb");
        $http({
            method : "POST",
            url : "/admin/gettoprevenue",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {type:'property'}
        }).then(function mySucces(response) {
            labels = [];
            data = [];
            //$window.alert(JSON.stringify(response.data))

            for(item in response.data.value)
            {

                labels.push(response.data.value[item].title);
                data.push(response.data.value[item].netrevenue);

            }
            //$window.alert(labels)

            //$window.alert(data)

            $scope.series = ['property top revenue'];
            $scope.labels = labels;
            $scope.data = [data];
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });

        $http({
            method : "POST",
            url : "/admin/gettoprevenue",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {type:'city'}
        }).then(function mySucces(response) {
            clabels = [];
            cdata = [];

            for(item in response.data.value)
            {

                clabels.push(response.data.value[item].city);
                cdata.push(response.data.value[item].netrevenue);

            }

            $scope.cityseries = ['city top revenue'];
            $scope.citylabels = clabels;
            $scope.citydata = [cdata];
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });

        $http({
            method : "POST",
            url : "/admin/gettoprevenue",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {type:'host'}
        }).then(function mySucces(response) {
            hlabels = [];
            hdata = [];
            //$window.alert('host ' + JSON.stringify(response.data))

            for(item in response.data.value)
            {
                hlabels.push(response.data.value[item].firstname + "  "+response.data.value[item].lastname);
                hdata.push(response.data.value[item].netrevenue);
            }

            $scope.hostseries = ['host top revenue'];
            $scope.hostlabels = hlabels;
            $scope.hostdata = [hdata];
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });

    }
    $scope.searchbill = function()
    {
        //$window.alert("search bill");
    }
    $scope.searchhosts = function () {
        //$window.alert("search hosts");
    }

    $scope.addhosts = function () {
        //$window.alert("add hosts");
        $http({
            method : "GET",
            url : "/admin/gethostrequests",
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function mySucces(response) {

           // $window.alert("sdfsdfsdf");
            $scope.hostDetails = response.data;
            //$scope.logintime = response.data.logintime;
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });

    }
    $scope.approvehost = function(id){
        console.log(id)
        var obj = {hostid:id};
        $http({
            method : "POST",
            url : "/admin/approvehost",
            headers: {
                'Content-Type': 'application/json'
            },
            data: obj
        }).then(function mySucces(response) {
            $http({
                method : "GET",
                url : "/admin/gethostrequests",
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(function mySucces(response) {

                // $window.alert("sdfsdfsdf");
                $scope.hostDetails = response.data;
                //$scope.logintime = response.data.logintime;
            }, function myError(response) {
                // $scope.myWelcome = response.statusText;
            });
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });
    }
    $scope.rejecthost = function(id){
        console.log(id)
        var obj = {hostid:id};
        $http({
            method : "POST",
            url : "/admin/rejecthost",
            headers: {
                'Content-Type': 'application/json'
            },
            data: obj
        }).then(function mySucces(response) {
            $http({
                method : "GET",
                url : "/admin/gethostrequests",
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(function mySucces(response) {

                // $window.alert("sdfsdfsdf");
                $scope.hostDetails = response.data;
                //$scope.logintime = response.data.logintime;
            }, function myError(response) {
                // $scope.myWelcome = response.statusText;
            });
        }, function myError(response) {
            // $scope.myWelcome = response.statusText;
        });
    }
});