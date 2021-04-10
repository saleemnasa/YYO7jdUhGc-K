const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');

const v1 = require('./routes/v1');
const app = express();
const path = require('path');
const CONFIG = require('./config/config');

const multer = require('multer');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app)
//DATABASE
const models = require("./models/mongoModels");

if (CONFIG.app === 'dev') {
  // models.sequelize.sync();//creates table if they do not already exist
  // models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
}
// CORS
app.use(cors());
// app.use('/static', express.static('public'));
app.use('/static', express.static('public'))
app.use('/v1', v1);
app.use(express.static(__dirname + '/public/uploads'));
app.use('/', function (req, res) {
  res.statusCode = 200;//send the appropriate status code
  res.json({ status: "success", message: "Parcel Pending API", data: {} })
});
//./public/uploads/
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// }
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// //Upload route
// app.post('/upload', upload.single('image'), (req, res, next) => {
//   try {
//     return res.status(201).json({
//       message: 'File uploded successfully'
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});