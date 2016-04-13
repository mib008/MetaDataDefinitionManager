var colors = require("colors");

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function middleware(req, res, next) {

        var conn1 = require("../../modules/dbConn").connection.getInstance();
        var conn2 = require("../../modules/dbConn").connection.getInstance();

        res.writeHead(200);
        
        res.write('Succeed DB connection. conn1 as id ' + conn1.threadId + "</br>");
        res.write('Succeed DB connection. conn2 as id ' + conn2.threadId + "\r\n");
        
        res.end();

    }
    
    return middleware;
}();

