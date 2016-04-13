
// ReSharper disable UseOfImplicitGlobalInFunctionScope

module.exports = function (angular) {
    "use strict";
    
    // ReSharper disable once InconsistentNaming
    var HTTP_SUCCESS = "success";
    
    angular.module('app').service('httpService', [
        '$http', '$location', 'commonConst', 'servicePathConst', 
        function ($http, $location, commonConst, servicePathConst) {
            
            // Http
            this.http = function (method, url, params, succeedCallback, failedCallback) {
                var fullUrl = servicePathConst.service_api_root ? servicePathConst.service_api_root + url : url;
                
                $http({ method: method, url: fullUrl, dataType: 'JSON', params: params }).then(function (data, status, headers, config) {
                    if (!data || data.result !== HTTP_SUCCESS) {
                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }

                        return;
                    }
                    
                    if (succeedCallback) succeedCallback(data, status, headers, config);

                }, function (data, status, headers, config) {
                    if (status === 401) {
                        if (confirm("Not Login.") === true) {
                            window.location.href = commonConst.login_page_url;
                        }
                    } else {
                        console.log(JSON.stringify(config));
                        
                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }
                    }
                });
            };
            
            // Get Method
            this.getService = function (url, params, succeedCallback, failedCallback) {
                var config = { params : params };
                
                var fullUrl = servicePathConst.service_api_root? servicePathConst.service_api_root + url : url;
                
                $http.get(fullUrl, config).success(function (data, status, headers, config) {
                    if (!data || data.result !== HTTP_SUCCESS) {
                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }

                        return;
                    }
                    
                    if (succeedCallback) succeedCallback(data, status, headers, config);

                }).error(function (data, status, headers, config) {
                    if (status === 401) {
                        if (confirm("Not Login.") === true) {
                            window.location.href = commonConst.login_page_url;
                        }
                    } else {
                        console.log(JSON.stringify(config));
                        
                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }
                    }
                });
            };
            
            // Post Method
            this.postService = function (url, params, succeedCallback, failedCallback) {
                var fullUrl = servicePathConst.service_api_root ? servicePathConst.service_api_root + url : url;
                
                $http.post(fullUrl, params).success(function (data, status, headers, config) {
                    if (!data || data.result !== HTTP_SUCCESS) {
                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }

                        return;
                    }
                    
                    if (succeedCallback) succeedCallback(data, status, headers, config);

                }).error(function (data, status, headers, config) {
                    if (status === 401) {
                        if (confirm("Not Login.") === true) {
                            window.location.href = commonConst.login_page_url;
                        }
                    } else {
                        console.log(JSON.stringify(config));

                        if (failedCallback) {
                            if (!data) data = {};
                            if (!data.message) data.message = "No message received.";
                            failedCallback(data, status);
                        }
                    }
                });
            };
        }]);
}(angular);


