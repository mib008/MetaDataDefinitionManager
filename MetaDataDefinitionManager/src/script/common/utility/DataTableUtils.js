// ReSharper disable NativeTypePrototypeExtending
(function () {
    
    var dataTableColDefs = {
        metaDataList: {
            columns: [ 
                // { title: "ID", data: "id", visible: false },
                { title: "System Name", data: "systemName" },
                { title: "Table Schema", data: "tableSchema" },
                { title: "Table Name", data: "tableName" },
                { title: "Table Comment", data: "tableComment" },
                { title: "Extend Table Comment", data: "extendTableComment" },
                {
                    render: function (data, type, full, meta) {
                        return '<span class="mif-pencil" title="edit" tag="' + full.id + '"></span>';
                    }
                },
                {
                    render: function (data, type, full, meta) {
                        return '<span class="mif-list" title="detail" tag="/tableDetailMetaData/' + full.systemName + "/" + full.tableSchema + "/" + full.tableName + '"></span>';
                    }
                }
            ]
        },
        columnMetaDataList: {
            columns: [ 
                // { title: "ID", data: "id", visible: false },
                { title: "Position", data: "position" },
                { title: "System Name", data: "systemName" },
                { title: "Table Schema", data: "tableSchema" },
                { title: "Table Name", data: "tableName" },
                { title: "Column Name", data: "columnName" },
                { title: "Column Comment", data: "columnComment" },
                { title: "Extend Column Comment", data: "extendColumnComment" },
                {
                    render: function (data, type, full, meta) {
                        return '<span class="mif-pencil" title="edit" tag="' + full.id + '"></span>';
                    }
                }
            ]
        }
    };
    
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
            
            if (element.length > 0 && dataTableColDefs.hasOwnProperty(element[0].id)) {
                o.columns = dataTableColDefs[element[0].id].columns;
            }
            
            if ($().dataTable) {
                var dataTable = element.dataTable(o);
                
                if (dataTable && dataTable.hasOwnProperty("0")) {
                    document["dataTable_" + dataTable[0].id] = dataTable;
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
    
    
    
    if ($().dataTable) {
        //try {
        //    debugger;            

        //    $().dataTable.prototype.oldCons = $().dataTable.prototype.constructor;
            
        //    $().dataTable.constructor = function (option) {
        //        debugger;
                
        //        var result = $().dataTable.oldCons(option);
                
        //        $().dataTableIns.push(result);
                
        //        return result;
        //    };

        //    $().dataTable.prototype.dataTableIns = [];

        //    $().dataTable.prototype.findById = function (id) {
        //        debugger;

        //        var index = -1;
        //        if ($().dataTableIns && $().dataTableIn instanceof Array) {
        //            $().dataTableIns.forEach(function(item, i) {
        //                if (item[0] && item.id === id) index = i;
        //            });
        //        }

        //        return index < 0 ? undefined : $().dataTableIns[index];
        //    };
        //} catch (e) {

        //}
    } else {
        console.log('Warn: dataTable plugin required');
    }
})();