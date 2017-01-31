app.controller('profileController', ['$scope', '$http', 'ngProgress', '$state', '$rootScope', '$uibModal', 'Upload', 'Notification', function ($scope, $http, ngProgress, $state, $rootScope, $uibModal, Upload, Notification) {
    $scope.profile_menus = [
        {
            name: "Dashboard",
            id: "dashboard-item",
            link: "users"

        },
        {
            name: "Your Listing",
            id: "rooms-item",
            link: "users.listings"

        },
        {
            name: "Your Trips",
            id: "your-trips-item",
            link: "users.trips"
        },
        {
            name: "Profile",
            id: "user-profile-item",
            link: "users"
        },
        {
            name: "Account",
            id: "account-item",
            link: "users.account"
        }
    ];

    $scope.editProfileMenus = [
        {
            name: "Edit Profile",
            link: "users.edit"
        },
        {
            name: "Photos, Symbol, and Video",
            link: "users.edit.media"
        },
        {
            name: "Trust and Verification",
            link: "/"
        },
        {
            name: "Reviews",
            link: "users.edit.review"
        },
        {
            name: "References",
            link: "/"
        },
    ]
    $scope.listingMenus = [
        {
            name: "Your Listing",
            link: "users.listings"
        },
        {
            name: "Your Property Requests",
            link: "users.listings.propert_requests"
        },
        {
            name: "Reservation Requirements",
            link: "#"
        },
    ];

    $scope.selectedListingMenu = 0;
    $scope.selectListingMenu = function (index) {
        $scope.selectedListingMenu = index;
    };

    $scope.selected = 3;
    $scope.selectedEditMenu = 0;

    $scope.selectMenu = function (index) {
        $scope.selected = index;
    };

    $scope.selectEditMenu = function (index) {
        $scope.selectedEditMenu = index;
    };

    $scope.getUser = function () {
        // debugger
        if(sessionStorage.user){
            $scope.user_info = JSON.parse(sessionStorage.user);
            $scope.birthday = $scope.user_info.birthdate.split("/");
            $scope.user_info.currency = "USD";
            $scope.user_info.language = "en";
            $scope.profileImage = $scope.user_info.profile_image;
            $scope.$parent.$parent.profileImage_icon = $scope.user_info.profile_image;
        }
        // $http.get("/users/profile")
        //     .success(function (data) {
        //         debugger
        //         if (data.code === 200) {
        //             console.log(data.user);
        //             $scope.user_info = data.user;
        //             $scope.birthday = $scope.user_info.birthdate.split("/");
        //             $scope.user_info.currency = "USD";
        //             $scope.user_info.language = "en";
        //             $scope.profileImage = data.user.profile_image;
        //             $scope.$parent.$parent.profileImage_icon = data.user.profile_image;
        //         } else if (data.code === 401) {
        //             if (data.value.code) {
        //                 Notification.error(data.value.code);
        //             } else {
        //                 Notification.error(data.value);
        //             }

        //         }
        //     })
        //     .error(function (err) {

        //     })
    };

    $scope.upload_profile_pic = function (file) {
        // debugger
        if (file && file.length) {
            $scope.profileImage = file[0];
            Upload.upload({
                url: '/users/upload_profile_pic',
                file: $scope.profileImage
            }).success(function (data) {
                if (data.code === 200) {
                    Notification.success("Successfully updated the profile image.");
                    $scope.$parent.$parent.profileImage_icon = data.src;
                    $scope.user_info.profile_image = data.src;
                } else if (data.error) {
                    Notification.error(data.error);
                    console.log(JSON.stringify(data));
                }
            })
                .error(function (err) {
                    console.log(err);
                })
        }
    };

    $scope.updateProfile = function () {
        $scope.user_info.birthdate = $scope.birthday.join("/");
        $http.post("/users/update_profile", $scope.user_info)
            .success(function (data) {
                // debugger
                if (data.code === 200) {
                    Notification.success("Profile Updated Successfully.");
                } else if (data.code === 401) {
                    Notification.error(data.valule);
                }
            })
            .error(function (err) {

            })
    };
}]);
