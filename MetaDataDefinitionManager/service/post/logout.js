var colors = require("colors"),
    auth = require("../../modules/auth");

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var middleware = function (req, res, next) {
        
        var info = '';
        req.addListener('data', function (chunk) {
            info += chunk;
        }).addListener('end', function () {
            info = JSON.parse(info);
            
            var result = auth.logout(info.userName);
            
            if (result) {
                res.writeHead(200, {
                    status: "200",
                    "Content-Type": "text/json; charset=UTF-8",
                    message: 'Logout succeed.',
                    userName: info.userName
                });
                
                res.end();
            } else {
                res.writeHead(500, {
                    status: "500",
                    message: 'Logout failed.'
                });
                
                res.end();
            }
        });

    }
    
    return middleware;
}();

