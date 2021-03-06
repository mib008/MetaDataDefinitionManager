﻿// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    angular.module('app').controller('tableMetaDataCtrl', [
        '$scope', '$location', 'commonService', 'httpService', 'servicePathConst',
        function ($scope, $location, commonService, httpService, servicePathConst) {
            
            var dialog = undefined;
            
            var doSearch = function (data) {
                data.sourceTable = "table";
                
                httpService.postService(servicePathConst.get_meta_data, data, function (data) {
                    if (data.data && data.data instanceof Array && data.data.length > 0) $scope.vm.dataList = data.data;
                    else $scope.message = "No record found.";
                }, function (data, status) {
                    alert(JSON.stringify(data.message));
                });
            };
            
            // 初始化页面
            var initView = function () {
                httpService.postService(servicePathConst.get_search_criteria, { tableName : "table" }, function (data) {
                    $scope.systemNameSource = data.data.systemName;
                    $scope.tableSchemaSource = data.data.tableSchema;
                    $scope.tableNameSource = data.data.tableName;
                    
                    if (angular.isArray(data.data.tableName)) $scope.$emit("updateCount", { table: data.data.tableName.length });
                    
                    $scope.vm = {};
                    $scope.vm.systemName = undefined;
                    $scope.vm.tableSchema = undefined;
                    $scope.vm.tableName = undefined;
                    
                    var jsonData = sessionStorage.getItem("userInfo");
                    if (jsonData && jsonData.length > 0) {
                        $scope.userIndfo = JSON.parse(jsonData);
                    }
                    
                    $scope.vm.__defineSetter__('dataList', function (data) {
                        this.val = data;
                        
                        var dataTable = document.dataTable_metaDataList;
                        if (dataTable) {
                            dataTable.fnClearTable();
                            dataTable.fnAddData(data);
                        }
                    });
                    
                    $scope.vm.__defineGetter__('dataList', function () { return this.val });

                }, function (data, status) {
                    alert(JSON.stringify(data.message));
                });
            }();
            
            // Search 按钮
            $scope.buttonSearch_click = function () {
                var data = {
                    systemName: $scope.vm.systemName ? $scope.vm.systemName: "null",
                    tableSchema: $scope.vm.tableSchema ? $scope.vm.tableSchema : "null",
                    tableName: $scope.vm.tableName ? $scope.vm.tableName : "null",
                    keyword : $scope.vm.keyword ? $scope.vm.keyword : "null"
                }
                
                doSearch(data);
            };
            
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
                        case "detail":
                            var url = $(obj).attr("tag");
                            $location.path(url);
                            break;
                        default:
                    }
                }
            };
            
            // 提交按钮
            $scope.commit_click = function () {
                var data = {
                    id: $scope.editVM.id,
                    tableComment: $scope.editVM.tableComment,
                    extendTableComment: $scope.editVM.extendTableComment
                };
                
                httpService.postService(servicePathConst.update_comment + "?tableName=table", data, function (data) {
                    if (dialog) dialog.close();
                    
                    data = {
                        systemName: $scope.vm.systemName ? $scope.vm.systemName: "null",
                        tableSchema: $scope.vm.tableSchema ? $scope.vm.tableSchema : "null",
                        tableName: $scope.vm.tableName ? $scope.vm.tableName : "null",
                        keyword : $scope.vm.keyword ? $scope.vm.keyword : "null"
                    }
                    
                    doSearch(data);
                }, function (data, status) {
                    alert(JSON.stringify(data.message));
                });
            };
            
            // 编辑字段详情按钮
            $scope.columnDetail_click = function () {
                
                var item = commonService.findFromArrayBy($scope.vm.dataList, $scope.editVM.id);
                
                if (item) {
                    
                    $location.path('/tableDetailMetaData/' + item.systemName + 
                    '/' + item.tableSchema +
                    '/' + item.tableName);
                }

                
            };
        }
    ]);
}(angular);