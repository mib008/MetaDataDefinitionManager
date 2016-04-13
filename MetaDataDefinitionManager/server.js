//  The server providing mock service

var express = require("express"),
    logger = require('express_logger'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require("path");

// Web server
var app = express();
var port = process.env.port || 1237;

// app.use(express.favicon());
app.use(logger('detailed'));

// app.use(cookieParser('keyboard cat'));
app.use(session({ secret: 'keyboard cat' }));

// 使用该中间件，在下方的处理中捕获异步程序中的异常。
app.use(require('express-domain-middleware'));

// 一般来说非强制性的错误处理一般被定义在最后
// 错误处理的中间件和普通的中间件定义是一样的， 只是它必须有4个形参， 这是它的形式： (err, req, res, next):
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
});

var regExp = '/\**/';
app.use(regExp, require('./middleware/checkLogin'));

var routerMiddleware = function (require) {
    var router = express.Router();
    
    // Services
    router.all(regExp, require('./middleware/serviceRouter'));
    
    // Http server
    router.get(regExp, require('./middleware/httpRouter'));
    
    return router;
}(require);

app.use(regExp, routerMiddleware);

console.log(app.routes);



app.listen(port, function () {
    console.log("Listening on " + port);

    // require('child_process').exec('start "" "http://localhost:' + port + '"');
});

// supervisor server.js
