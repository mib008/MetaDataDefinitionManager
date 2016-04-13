
// ReSharper disable UseOfImplicitGlobalInFunctionScope
module.exports = function (angular) {
    "use strict";

    angular.module('app').service('commonService', ['commonValue', function (commonValue) {
            this.findFromArrayBy = function (array, id, prop) {
                if (!array || !(array instanceof Array) || !id) return undefined;
                
                if (!prop) prop = "id";
                
                for (var i = 0; i < array.length; i++) {
                    if (array[i][prop] === id) return array[i];
                }
                
                return undefined;
            };
        }]);
}(angular);

