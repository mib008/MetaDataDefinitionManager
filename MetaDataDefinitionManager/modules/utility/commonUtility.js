﻿var consts = require("../consts");

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
    
    
    return {
        convertColToDb: convertColToDb,
        convertColToClient: convertColToClient,
        parseSql: parseSql
    };
}();

