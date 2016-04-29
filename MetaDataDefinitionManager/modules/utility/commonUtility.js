var consts = require("../consts");

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var dataDef = consts.dataDefines;
    
    var convertColToDb = function (obj, tableName) {
        if (!obj) return obj;
        
        var columnMapping = undefined;
        
        switch (tableName) {
            case "table":
                columnMapping = dataDef.table_dictionary;
                break;
            case "column":
                columnMapping = dataDef.table_meta_dictionary;
                break;
            default:
                if (dataDef.hasOwnProperty(tableName)) {
                    columnMapping = dataDef[tableName];
                } else {
                    console.log("util.convertColToDb: No definition for table:" + tableName);
                }
                break;
        }
        
        if (!columnMapping) return obj;
        
        columnMapping.forEach(function (item, index) {
            if (!obj.hasOwnProperty(item.column)) return;
            
            if (item.originColumn !== item.column) {
                obj[item.originColumn] = obj[item.column];
                delete obj[item.column];
            }
        });
        
        return obj;
    };
    
    var convertColToClient = function (obj, tableName) {
        if (!obj) return obj;
        
        var columnMapping = undefined;
        
        switch (tableName) {
            case "table":
                columnMapping = dataDef.table_dictionary;
                break;
            case "column":
                columnMapping = dataDef.table_meta_dictionary;
                break;
            default:
                if (dataDef.hasOwnProperty(tableName)) {
                    columnMapping = dataDef[tableName];
                } else {
                    console.log("util.convertColToClient: No definition for table:" + tableName);
                }
                break;
        }
        
        if (!columnMapping) return obj;
        
        columnMapping.forEach(function (item, index) {
            if (!obj.hasOwnProperty(item.originColumn)) return;
            
            if (item.originColumn !== item.column) {
                obj[item.column] = obj[item.originColumn];
                delete obj[item.originColumn];
            }
        });
        
        return obj;
    }
    
    var parseSql = function (stmt) {
        if (!stmt) return undefined;
        
        if (!stmt.sql) return stmt.sql;
        
        if (!stmt.values || !(stmt.values instanceof Array) || stmt.values.length < 1) return stmt.sql;
        
        var target = stmt.sql;
        stmt.values.forEach(function (item, index) {
            if (typeof (item) == "string") {
                target = target.replace("$" + (index + 1), "'" + item + "'");
            } else {
                target = target.replace("$" + (index + 1), item);
            }
        });
        
        return target;
    };
    
    
    /*
    * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
    * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
    * 返回精度为：秒，分，小时，天
    */
    var getDateDiff = function (startTime, endTime, diffType) {
        try {
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
            startTime = startTime ? startTime.replace(/\-/g, "/") : undefined;
            endTime = endTime ? endTime.replace(/\-/g, "/") : undefined;
            
            //将计算间隔类性字符转换为小写
            diffType = diffType.toLowerCase();
            
            var sTime = startTime ? new Date(startTime) : new Date(); //开始时间
            var eTime = endTime ? new Date(endTime) : new Date(); //结束时间
            //作为除数的数字
            var divNum = 1;
            switch (diffType) {
                case "second":
                    divNum = 1000;
                    break;
                case "minute":
                    divNum = 1000 * 60;
                    break;
                case "hour":
                    divNum = 1000 * 3600;
                    break;
                case "day":
                    divNum = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
        } catch (ex) {
            return "--";
        }
    };
    
    return {
        convertColToDb: convertColToDb,
        convertColToClient: convertColToClient,
        parseSql: parseSql,
        getDateDiff: getDateDiff
    };
}();

