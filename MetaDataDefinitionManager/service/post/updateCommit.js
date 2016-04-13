var dbConn = require("../../modules/dbConn"),
    consts = require("../../modules/consts"),
    util = require("../../modules/utility/commonUtility"),
    stringUtil = require("../../modules/utility/stringUtility"),
    colors = require("colors"),
    SqlGenerator = require('sql-generator');


// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function generateSql(updateContent ,tableName) {
        var sqlgen = new SqlGenerator();

        var data = {};
        
        for (var prop in updateContent) {
            if (updateContent.hasOwnProperty(prop) && "null" !== updateContent[prop]) {
                if (prop !== "id") data[prop] = updateContent[prop];
            };
        }
        
        var stmt = undefined;
        
        switch (tableName) {
            case "table":
                stmt = sqlgen.update('service.table_dictionary', { id: updateContent.id }, data);
                break;
            case "column":
                stmt = sqlgen.update('service.table_meta_dictionary', { id: updateContent.id }, data);
                break;
            default:
                break;
        }
        
        return stmt;
    };
    
    var middleware = function (req, res, next) {
        var updateContent = '';
        req.addListener('data', function (chunk) {
            updateContent += chunk;
        }).addListener('end', function () {
            updateContent = JSON.parse(updateContent);
            
            updateContent = util.convertColToDb(updateContent, req.query.tableName);
            
            if (!updateContent.id || updateContent.id.isNullOrWhitespace()) {
                res.writeHead(500);
                
                res.write(JSON.stringify({
                    result : consts.http_result_error,
                    data : undefined,
                    message: "No 'id' specified when update table 'service.table_dictionary'."
                }));
                
                res.end();
            } else {
                var stmt = generateSql(updateContent, req.query.tableName);
                
                var sql = util.parseSql(stmt);
                
                var pool = dbConn.pool;
                
                console.log('getMetaData SQL: %s', sql);
                
                pool.query(sql, function (err, rows, fields) {
                    if (err) {
                        console.log(err.toString().red);
                        
                        res.writeHead(500);

                        res.write(JSON.stringify({
                            result : consts.http_result_error
                        }));
                    } else {
                        res.writeHead(200);
                        
                        res.write(JSON.stringify({
                            result : consts.http_result_success,
                            data : rows,
                            fields: fields
                        }));
                    }
                    
                    res.end();
                    
                });
            }
        });
    }
    
    return middleware;
}();

