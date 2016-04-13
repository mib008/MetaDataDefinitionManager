// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    angular.module('app').controller('headBarCtrl', [
        '$scope', '$location', 'httpService', 'commonConst', 'servicePathConst',
        function ($scope, $location, httpService, commonConst, servicePathConst) {
            
            var initView = function () {
                //$scope.userIndfo = function() {
                //    var jsonData = sessionStorage.getItem("userInfo");
                //    if (jsonData && jsonData.length > 0) {
                //        return JSON.parse(jsonData);
                //    }

                //    return undefined;
                //}();

                $scope.userIndfo = angular.fromJson(sessionStorage.getItem("userInfo"));
            }();
            
            $scope.logout = function () {
                httpService.postService(servicePathConst.user_logout, $scope.userIndfo, function (data) {
                    window.location.href = commonConst.login_page_url;
                }, function (data, status) {
                    window.location.href = commonConst.login_page_url;
                });
            };
        }
    ]);
}(angular);