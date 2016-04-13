var colors = require("colors"), 
    uuid = require('uuid');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var session = [];
    
    var config = require("./configs");
    
    function login(info, req) {
        var targetIndex = -1;
        session.forEach(function (item, index) {
            if (item.userName === info.userName) {
                targetIndex = index;
            }
        });
        
        if (targetIndex > -1) {
            session[targetIndex] = {
                userName: info.userName,
                token: session[targetIndex].token,
                loginDate: new Date(),
                sessionID: req.sessionID,
                editable: session[targetIndex].editable
            };
            
            return session[targetIndex];
        } else {
            targetIndex = -1;
            config.allowedList.forEach(function (item, index) {
                if (item === info.companyId) {
                    targetIndex = index;
                }
            });
            
            var newSession = {
                userName : info.userName,
                token    : uuid.v4(),
                loginDate: new Date(),
                sessionID: req.sessionID,
                editable : targetIndex > -1
            }
            
            session.push(newSession);
            
            return newSession;
        }
    };
    
    function checkHtmlRequest(req) {
        var targetIndex = -1;
        session.forEach(function (item, index) {
            if (item.sessionID === req.sessionID) {
                targetIndex = index;
            }
        });
        
        if (targetIndex > -1) {
            return session[targetIndex];
        }
        
        return undefined;
    };
    
    function checkServiceRequest(req) {
        var targetIndex = -1;
        session.forEach(function (item, index) {
            if (item.token === req.headers.token) {
                targetIndex = index;
            }
        });
        
        if (targetIndex > -1) {
            return session[targetIndex];
        }
        
        return undefined;
    };
    
    function checkEditable(req) {
        var targetIndex = -1;
        session.forEach(function (item, index) {
            if (item.token === req.headers.token && item.editable === true) {
                targetIndex = index;
            }
        });
        
        if (targetIndex > -1) {
            return session[targetIndex];
        }
        
        return undefined;
    };
    
    function logout(userName) {
        var targetIndex = -1;
        session.forEach(function (item, index) {
            if (item.userName === userName) {
                targetIndex = index;
            }
        });
        
        if (targetIndex > -1) {
            session.splice(targetIndex, 1);
        }
        
        return true;
    };
    
    return {
        login: login,
        checkHtmlRequest: checkHtmlRequest,
        checkServiceRequest: checkServiceRequest,
        checkEditable: checkEditable,
        logout: logout
    };
}();

