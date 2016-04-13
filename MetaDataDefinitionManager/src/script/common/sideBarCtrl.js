// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    angular.module('app').controller('sideBarCtrl', [
        '$scope', '$location', 'httpService', 'commonConst', 'servicePathConst',
        function ($scope, $location, httpService, commonConst, servicePathConst) {
            
            $scope.linkList = [
                { link: "#/tableMetaData", tag: "tableMetaData", displayName: "Tables", iconClass : "mif-apps" },
                { link: "#/columnMetaData", tag: "columnMetaData", displayName: "Columns", iconClass : "mif-apps" },
            ];
            
            $scope.isActive = function (tag) {
                return $location.$$path.indexOf('/' + tag) >= 0;
            };

            $scope.$on('updateCountBC', function (e, args) {
                if (args && args.table) {
                    $scope.linkList[0].count = args.table;
                }
            });
        }
    ]);
}(angular);