// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    angular.module('app').controller('indexCtrl', ['$scope', function ($scope) {
            $scope.$on('updateCount', function (e, args) {
                $scope.$broadcast('updateCountBC', args);
            });
        }
    ]);
}(angular);