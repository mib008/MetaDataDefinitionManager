var dbConn = require("../../modules/dbConn"),
    consts = require("../../modules/consts"),
    util = require("../../modules/utility/commonUtility"),
    SqlGenerator = require('sql-generator');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var sql = 'SELECT * ' +
        'FROM service.table_dictionary ' +
        'order by SYSTEM_NAME ,TABLE_SCHEMA ,TABLE_NAME;';
    
    
    var convertData = function (rows, fields, tableName) {
        var result = {};
        
        if (!fields || !(fields instanceof Array)) {
            return result;
        }
        
        fields.forEach(function (field, index) {
            
            var tempSet = new Set();
            
            rows.map(x => {
                if (x && x[field.name] && x[field.name].length > 0) tempSet.add(x[field.name]);
            });
            
            console.log("field.name: " + field.name + " tempSet:" + tempSet);
            
            result[field.name] = Array.from(tempSet);
        });
        
        result = util.convertColToClient(result, tableName);
        
        return result;
    };
    
    function generateSql(tableName) {
        var sqlgen = new SqlGenerator();
        
        var stmt = sqlgen.select(tableName, '*', {}, { order: ["SYSTEM_NAME" , "TABLE_SCHEMA" , "TABLE_NAME"] });
        
        return stmt;
    };
    
    function middleware(req, res, next) {
        
        var data = '';
        req.addListener('data', function (chunk) {
            data += chunk;
        }).addListener('end', function () {
            data = JSON.parse(data);
            
            var stmt = undefined;
            switch (data.tableName) {
                case "table":
                    stmt = generateSql("service.table_dictionary");
                    break;
                case "column":
                    stmt = generateSql("service.table_meta_dictionary");
                    break;
                default:
                    break;
            }
            
            if (!stmt) {
                res.writeHead(500);
                
                res.write(JSON.stringify({
                    result : consts.http_result_error,
                    data : undefined,
                    message: "No table name " + data.tableName + " found."
                }));
                
                res.end();
            } else {
                var sql = util.parseSql(stmt);
                
                var pool = dbConn.pool;

                pool.query(sql, function (err, rows, fields) {
                if (err) console.log(err.toString().red);

                    var targetData = convertData(rows, fields, data.tableName);
                    
                    res.writeHead(200);
                    
                    var result = {
                        result : consts.http_result_success,
                        data : targetData,
                        fields: fields
                    };
                    
                    res.write(JSON.stringify(result));
                    
                    res.end();
                });
            }
        });
    }
    
    return middleware;
}();

