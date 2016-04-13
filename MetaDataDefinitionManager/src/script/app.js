angular.module('app', ['ngRoute']).run(['$http', function ($http) {
    var jsonData = sessionStorage.getItem("userInfo");
    if (jsonData && jsonData.length > 0) {
        var userIndfo = JSON.parse(jsonData);
        if (userIndfo) $http.defaults.headers.common.token = userIndfo.token;
    }
}]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tableMetaData', {
            templateUrl: 'view/tableMetaData.html',
            controller: 'tableMetaDataCtrl'
        }).when('/tableDetailMetaData/:systemName/:tableSchema/:tableName', {
            templateUrl: 'view/tableDetailMetaData.html',
            controller: 'tableDetailMetaDataCtrl'
        }).when('/columnMetaData', {
            templateUrl: 'view/columnMetaData.html',
            controller: 'columnMetaDataCtrl'
        }).otherwise({
            redirectTo: '/tableMetaData'
        });
    }
]).value('commonValue', {
    dataTables: []
}).constant('commonConst', {
    login_page_url : '/login.html'
}).constant('servicePathConst', {
    // 不设置： 使用页面所在域
    // service_api_root:,
    
    // 不设置： 使用页面所在域
    // auth_server: ,
    
    test_db_connection2 : 'service/testDbConnection2',
    
    user_logout : 'service/logout',
    
    get_search_criteria : 'service/getSearchCriteria',
    get_meta_data : 'service/getMetaData',
    
    update_comment : 'service/updateCommit'

});

// require('./common/directive/metroDataTable');

require('./common/utility/StringUtils');
require('./common/utility/DataTableUtils');

require('./common/service/httpService');
require('./common/service/commonService');

require('./common/headBarCtrl');
require('./common/sideBarCtrl');

// require('./sampleTableCtrl');
require('./indexCtrl');
require('./tableMetaDataCtrl');
require('./tableDetailMetaDataCtrl');
require('./columnMetaDataCtrl');