var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var cookieSession = require('cookie-session');
var cors = require('cors')
var app = express();

// 配置ejs中间件配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1) {
      cb(null, path.join(__dirname, 'public', 'upload', 'user'))
    } else if (req.url.indexOf('banner') !== -1) {
      cb(null, path.join(__dirname, 'public', 'upload', 'banner'))
    } else {
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
})

let multerObj = multer({ storage });//
app.use(multerObj.any())
app.get('/reg', (req, res, next) => {
  console.log(req.files);
  let oldfile = req.files[0].path
  let newfile = req.files[0].path + path.parse(req.files[0].originalname).ext
  fs.renameSync(oldfile, newfile)
  res.send({ err: 0, url: 'http://localhost:3000/public/upload/' + req.files[0].filename + path.parse(req.files[0].originalname).ext })
  res.end()
})

let arr = []
for (var i = 0; i < 1000; i++) {
  arr.push('1909' + Math.random())
}
app.use(cookieSession({
  name: '1909_id',
  keys: arr,
  maxAge: 1000 * 60 * 60 * 24 * 15
}))


//静态资源配置
app.use(express.static(path.join(__dirname, 'public', 'template')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));


//用户端
app.all('/api/*', require('./routes/api/gloablParams'))
app.use('/api/banner', require('./routes/api/banner'))
app.use('/api/column', require('./routes/api/column'))
app.use('/api/follow', require('./routes/api/follow'))
app.use('/api/home', require('./routes/api/home'))
app.use('/api/login', require('./routes/api/login'))
app.use('/api/logout', require('./routes/api/logout'))
app.use('/api/reg', require('./routes/api/reg'))
app.use('/api/user', require('./routes/api/user'))


//代理
app.use('/proxy/juhe', require('./routes/proxy/juhe'))
//cors 跨域中间件配置
/* app.use(cors({
  "origin": 'http://127.0.0.1:80',//被允许的域名
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",//被允许的提交方式
  "allowedHeaders": ['Content-Type', 'Authorization'],//运行写带的请求头
  "preflightContinue": false,
   "credentials":true,//白名单|跨源凭证
   "optionsSuccessStatus": 204
})) */
//管理端
/*app.get('/admin/home', (req, res, next) => {
  res.render('index', { title: '标题' })
}) */
app.all('/admin/*', require('./routes/admin/gloablParams'))
app.use('/admin/banner', require('./routes/admin/banner'))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);//检测是用户端还是管理端接口
  if (req.url.indexOf('admin') !== -1) {
    res.render('error');
  } else {//检测是否是以正确的提交方式提交
    res.send({ err: 1, msg: '错误的接口或者请求方式' })
  }

});

module.exports = app;
