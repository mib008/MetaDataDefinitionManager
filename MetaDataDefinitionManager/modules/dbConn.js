var colors = require("colors"),
    mysql = require('mysql');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var config = require("./configs");
    
    var connection = (function () {
        var instance;
        
        function init() {
            var conn = mysql.createConnection(config.dbConfig);
            
            conn.connect(function (err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }
                
                console.log('connected as id ' + conn.threadId);
            });
            
            console.log('return connection as id ' + conn.threadId);
            return conn;
        };
        
        return (function () {
            if (!instance) instance = init();
            return instance;
        })();
    })();
    
    function disconnection() {
        disconnection.end();
    };
    
    
    /***
     * 
     */

    var pool = (function () {
        var instance;
        
        function init() {
            var po = mysql.createPool(config.dbPoolConfig);
            
            return po;
        };
        
        return (function () {
            if (!instance) instance = init();
            return instance;
        })();
    })();
    
    var authPool = (function () {
        var instance;
        
        function init() {
            var po = mysql.createPool(config.authDbPoolConfig);
            
            return po;
        };
        
        return (function () {
            if (!instance) instance = init();
            return instance;
        })();
    })();
    
    return {
        pool: pool,
        authPool: authPool
        // connection: connection,
        // disconnection: disconnection
    };
}();

