var colors = require("colors"),
    path = require('path'),
    fs = require('fs'),
    mysql = require('mysql');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var config = eval("(" + fs.readFileSync('./modules/config.json', 'utf8') + ")");
    
    var dbConfig = function () {
        return config.database.dbConfig;
    }();
    
    var authDbConfig = function () {
        return config.database.authDbConfig;
    }();
    
    var dbPoolConfig = function () {
        var cfg = dbConfig;
        cfg.connectionLimit = config.database.dbPoolConfig.connectionLimit;
        return cfg;
    }();

    var authDbPoolConfig = function() {
        var cfg = authDbConfig;
        cfg.connectionLimit = config.database.dbPoolConfig.connectionLimit;
        return cfg;
    }();

    var httpErrPage = function () {
        return config.httpServer.httpErrPage;
    }();
    
    var httpBasePath = function () {
        return path.join(__dirname, '../', config.httpServer.httpBasePath);
    }();

    var allowedList = function() {
        return config.service.authSetting.allowed;
    }();

    var directoryWhiteList = function () {

        if (config.httpServer.directoryWhiteList)
            return config.httpServer.directoryWhiteList;
        else {
            return [];
        }
    }();

    var loginSetting = function() {
        if (config.httpServer.loginSetting) {
            return config.httpServer.loginSetting;
        } else {
            return {};
        }
    }();

    return {
        dbConfig: dbConfig,
        dbPoolConfig: dbPoolConfig,
        authDbPoolConfig: authDbPoolConfig,
        allowedList: allowedList,
        httpErrPage: httpErrPage,
        httpBasePath: httpBasePath,
        directoryWhiteList: directoryWhiteList,
        loginSetting: loginSetting,
        // connection: connection,
        // disconnection: disconnection
    };
}();

