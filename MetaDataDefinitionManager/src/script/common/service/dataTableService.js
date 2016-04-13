
// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";

    angular.module('app').service('dataTableService',  ['commonValue',
        function (commonValue) {
            $.widget("metro.datatablemk" , {
                
                version: "3.0.0",
                
                options: {
                },
                
                _create: function () {
                    var that = this, element = this.element, o = this.options;

                    $.each(element.data(), function (key, value) {
                        try {
                            o[key] = $.parseJSON(value);
                        } catch (e) {
                            o[key] = value;
                        }
                    });
                    
                    if ($().dataTable) {
                        try {
                            debugger;

                            var dataTable = element.dataTable(o);
                            
                            commonValue.dataTables.push(dataTable);
                        } catch (e) {

                        }
                    } else {
                        alert('dataTable plugin required');
                    }
                    
                    element.data('datatablemk', this);

                },
                
                _destroy: function () {
                },
                
                _setOption: function (key, value) {
                    this._super('_setOption', key, value);
                }
            });    
        }]);
}(angular);


