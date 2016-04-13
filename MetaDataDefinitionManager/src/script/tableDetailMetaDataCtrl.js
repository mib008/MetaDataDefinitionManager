// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    angular.module('app').controller('tableDetailMetaDataCtrl', [
        '$scope', '$location', '$routeParams', 'commonService', 'httpService', 'servicePathConst',
        function ($scope, $location, $routeParams, commonService, httpService, servicePathConst) {
            
            var dialog = undefined;
            
            var doSearch = function () {
                delete $scope.message;

                var data = {
                    systemName: $routeParams.systemName,
                    tableSchema: $routeParams.tableSchema,
                    tableName: $routeParams.tableName,
                    sourceTable : "column"
                };
                
                httpService.postService(servicePathConst.get_meta_data, data, function (data) {
                    if (data.data && data.data instanceof Array && data.data.length > 0) $scope.vm.dataList = data.data;
                    else $scope.message = "No columns found for this table.";
                }, function (data, status) {
                    alert(JSON.stringify(data.message));
                });
            };
            
            // 初始化页面
            var initView = function () {
                
                $scope.vm = {};
                $scope.vm.__defineSetter__('dataList', function (data) {
                    this.val = data;
                    
                    var dataTable = document.dataTable_columnMetaDataList;
                    if (dataTable) {
                        dataTable.fnClearTable();
                        dataTable.fnAddData(data);
                    }
                });
                
                $scope.vm.__defineGetter__('dataList', function () { return this.val });

                doSearch();
            }();
            
            
            // 单击表格
            $scope.table_click = function (e) {
                var ex = e || window.event;
                var obj = ex.target || ex.srcElement;
                
                if (obj.tagName === "TD") {
                    obj = obj.children[0];
                }
                
                if (obj) {
                    switch ($(obj).attr("title")) {
                        case "edit":
                            var id = $(obj).attr("tag");
                            var item = commonService.findFromArrayBy($scope.vm.dataList, id);
                            $scope.editVM = item;
                            console.log(JSON.stringify(item));
                            dialog = $("#editDialog").data('dialog');
                            dialog.open();
                            break;
                        default:
                    }
                }
            };
            
            // 提交按钮
            $scope.commit_click = function () {
                var data = {
                    id: $scope.editVM.id,
                    columnComment: $scope.editVM.columnComment,
                    extendColumnComment: $scope.editVM.extendColumnComment
                };
                
                httpService.postService(servicePathConst.update_comment + "?tableName=column", data, function (data) {
                    if (dialog) dialog.close();
                    
                    doSearch();
                }, function (data, status) {
                    alert(JSON.stringify(data.message));
                });
            };
        }
    ]);
}(angular);