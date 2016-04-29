// ReSharper disable Es6Feature
const colors = require("colors"), 
      uuid   = require('uuid');
// ReSharper restore Es6Feature

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var session = [];
    
    // ReSharper disable AssignToImplicitGlobalInFunctionScope
    // ReSharper disable Es6Feature
    const config        = require("./configs"),
          DATE_FORMAT   = "yyyy-MM-dd hh:mm:ss",
          commonUtility = require("./utility/commonUtility"),
          dateUtility   = require("./utility/dateUtility");
    // ReSharper restore Es6Feature
    // ReSharper restore AssignToImplicitGlobalInFunctionScope
    
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
                
                if (commonUtility.getDateDiff(item.loginDate.format(DATE_FORMAT), new Date().format(DATE_FORMAT), "minute") >= 30) {
                    session.splice(targetIndex, 1);
                    targetIndex = -1;
                } else {
                    item.loginDate = new Date();
                }
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
                
                // 年-月-日 小时:分钟:秒
                if (commonUtility.getDateDiff(item.loginDate.format(DATE_FORMAT), new Date().format(DATE_FORMAT), "minute") >= 30) {
                    session.splice(targetIndex, 1);
                    targetIndex = -1;
                } else {
                    item.loginDate = new Date();
                }
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
                
                if (commonUtility.getDateDiff(item.loginDate.format(DATE_FORMAT), new Date().format(DATE_FORMAT), "minute") >= 30) {
                    session.splice(targetIndex, 1);
                    targetIndex = -1;
                } else {
                    item.loginDate = new Date();
                }
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

