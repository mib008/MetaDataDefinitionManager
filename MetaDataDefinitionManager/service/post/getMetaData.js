var dbConn = require("../../modules/dbConn"),
    consts = require("../../modules/consts"),
    util = require("../../modules/utility/commonUtility"),
    colors = require("colors"),
    SqlGenerator = require('sql-generator');


// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    //var sql = 'SELECT * ' +
    //    'FROM service.table_dictionary ' +
    //    'order by SYSTEM_NAME ,TABLE_SCHEMA ,TABLE_NAME;';
    
    function generateSql(searchCriteria) {
        var sqlgen = new SqlGenerator();
        
        var tableName = searchCriteria.sourceTable;
        delete searchCriteria.sourceTable;
        
        var where = {};
        
        for (var prop in searchCriteria) {
            if (searchCriteria.hasOwnProperty(prop) && "null" !== searchCriteria[prop]) {
                if (prop === "keyword") {
                    switch (tableName) {
                        case "table":
                            where['-or'] = {
                                TABLE_COMMENT: { like: "%" + searchCriteria[prop] + "%" }, 
                                EXTEND_TABLE_COMMENT : { like: "%" + searchCriteria[prop] + "%" }
                            };
                            break;
                        case "column":
                            where['-or'] = {
                                COLUMN_COMMENT: { like: "%" + searchCriteria[prop] + "%" }, 
                                EXTEND_COLUMN_COMMENT : { like: "%" + searchCriteria[prop] + "%" }
                            };
                            break;
                        default:
                            break;
                    }
                } else {
                    where[prop] = searchCriteria[prop];
                }
            };
        }
        
        var stmt = undefined;
        
        switch (tableName) {
            case "table":
                stmt = sqlgen.select('service.table_dictionary', '*', where, { order: 'TABLE_NAME' });
                break;
            case "column":
                stmt = sqlgen.select('service.table_meta_dictionary', '*', where, { order: 'ORDINAL_POSITION' });
                break;
            default:
                break;
        }
        
        return stmt;
    };
    
    var middleware = function (req, res, next) {
        
        var searchCriteria = '';
        req.addListener('data', function (chunk) {
            searchCriteria += chunk;
        }).addListener('end', function () {
            searchCriteria = JSON.parse(searchCriteria);

            var sourceTable = searchCriteria.sourceTable;
            
            searchCriteria = util.convertColToDb(searchCriteria, sourceTable);
            
            var stmt = generateSql(searchCriteria);
            
            var sql = util.parseSql(stmt);
            
            var pool = dbConn.pool;
            
            console.log('getMetaData SQL: %s', sql);
            
            pool.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err.toString().red);
                    
                    res.write(JSON.stringify({
                        result : consts.http_result_error
                    }));
                    
                    res.writeHead(500);
                } else {
                    var targetData = [];
                    if (rows && (rows instanceof Array)) {
                        rows.forEach(function (item, index) {
                            targetData.push(util.convertColToClient(item, sourceTable));
                        });
                    }
                    
                    res.writeHead(200);
                    
                    var result = {
                        result : consts.http_result_success,
                        data : targetData,
                        fields: fields
                    };
                    
                    res.write(JSON.stringify(result));
                }

                res.end();
            });
        });
        
        
    }
    
    return middleware;
}();

