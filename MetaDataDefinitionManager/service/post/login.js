var dbConn = require("../../modules/dbConn"),
    colors = require("colors"),
    auth = require("../../modules/auth"),
    utils = require('utility'),
    commonUtil = require("../../modules/utility/commonUtility"),
    SqlGenerator = require('sql-generator');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function generateSql(info) {
        var sqlgen = new SqlGenerator();

        var pwd = utils.md5(info.userPwd);
        
        var stmt = sqlgen.select("idb_center.idb_account", '*', { USERNAME: info.userName, PASSWORD: pwd });
        
        return stmt;
    };
    
    var middleware = function (req, res, next) {
        
        var info = '';
        req.addListener('data', function (chunk) {
            info += chunk;
        }).addListener('end', function () {
            info = JSON.parse(info);
            
            var stmt = generateSql(info);
            
            var sql = commonUtil.parseSql(stmt);
            
            var authPool = dbConn.authPool;
            
            console.log('login SQL: %s', sql);
            
            authPool.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err.toString().red);
                    
                    res.write(JSON.stringify({
                        result : consts.http_result_error,
                        message: 'Login failed.'
                    }));
                    
                    res.writeHead(500);
                } else {
                    if (rows && (rows instanceof Array) && rows.length === 1) {
                        
                        var loginInfo = auth.login(commonUtil.convertColToClient(rows[0], "idb_account"), req);                        

                        res.writeHead(200, {
                            status: "200",
                            "Content-Type": "text/json; charset=UTF-8",
                            message: 'Login succeed.',
                            token: loginInfo.token
                        });
                        
                        res.write(JSON.stringify(loginInfo));
                    } else {
                        res.writeHead(401, {
                            status: "401",
                            message: 'Login failed.'
                        });
                    }
                }
                
                res.end();
            });
        });

    }
    
    return middleware;
}();

