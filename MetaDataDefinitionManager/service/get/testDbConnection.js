var colors = require("colors"),
    mysql = require('mysql');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function middleware(req, res, next) {
        
        var connection = mysql.createConnection({});

        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            
            console.log('connected as id ' + connection.threadId);

            res.writeHead(200, {
                status: "200",
                message: 'connected as id ' + connection.threadId
            });

            res.write('Succeed DB connection. connected as id ' + connection.threadId);

            res.end();
        });

        connection.end();

    }
    
    return middleware;
}();

