// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";

    angular.module('app').controller('sampleTableCtrl', [
        '$scope', '$location', 'httpService', 'servicePathConst',
        function ($scope, $location, httpService, servicePathConst) {
            
            $scope.message = '';
            
            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(2)', nRow).bind('click', function () {
                    $scope.$apply(function () {
                        $scope.someClickHandler(aData);
                    });
                });
                return nRow;
            };
            
            $scope.someClickHandler = function (info) {
                $scope.message = 'clicked: ' + info.price;
            };
            
            $scope.columnDefs = [ 
                { "mDataProp": "category", "aTargets": [0] },
                { "mDataProp": "name", "aTargets": [1] },
                { "mDataProp": "price", "aTargets": [2] }
            ];
            
            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200, /* 1 month */
                "bJQueryUI": true,
                "bPaginate": true,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            
            
            $scope.sampleProductCategories = [

                {
                    "name": "1948 Porsche 356-A Roadster",
                    "price": 53.9,
                    "category": "Classic Cars",
                    "action": "x"
                },
                {
                    "name": "1948 Porsche Type 356 Roadster",
                    "price": 62.16,
                    "category": "Classic Cars",
                    "action": "x"
                },
                {
                    "name": "1949 Jaguar XK 120",
                    "price": 47.25,
                    "category": "Classic Cars",
                    "action": "x"
                }
              ,
                {
                    "name": "1936 Harley Davidson El Knucklehead",
                    "price": 24.23,
                    "category": "Motorcycles",
                    "action": "x"
                },
                {
                    "name": "1957 Vespa GS150",
                    "price": 32.95,
                    "category": "Motorcycles",
                    "action": "x"
                },
                {
                    "name": "1960 BSA Gold Star DBD34",
                    "price": 37.32,
                    "category": "Motorcycles",
                    "action": "x"
                }
           ,
                {
                    "name": "1900s Vintage Bi-Plane",
                    "price": 34.25,
                    "category": "Planes",
                    "action": "x"
                },
                {
                    "name": "1900s Vintage Tri-Plane",
                    "price": 36.23,
                    "category": "Planes",
                    "action": "x"
                },
                {
                    "name": "1928 British Royal Navy Airplane",
                    "price": 66.74,
                    "category": "Planes",
                    "action": "x"
                },
                {
                    "name": "1980s Black Hawk Helicopter",
                    "price": 77.27,
                    "category": "Planes",
                    "action": "x"
                },
                {
                    "name": "ATA: B757-300",
                    "price": 59.33,
                    "category": "Planes",
                    "action": "x"
                }
            ];
        }
    ]);
}(angular);