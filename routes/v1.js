const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
// const CompanyController = require('../controllers/company.controller');
// const HomeController = require('../controllers/home.controller');
// const PostController = require('../controllers/post.controller');
// const uploadController = require('../controllers/upload.controller');
const GroupController = require('../controllers/group.controller');

const multer = require('multer');
const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Parcel Pending API", data: { "version_number": "v1.0.0" } })
});
var storageVendor = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req, '3333333333333333333333333')
    callback(null, "public/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var uploadVendor = multer({ storage: storageVendor })
router.post('/users', UserController.create);                                                    // C
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.get);        // R
router.put('/users/:id',
  uploadVendor.single("myImage"),
  // passport.authenticate('jwt', { session: false }),
  UserController.update);     // U
router.delete('/users', passport.authenticate('jwt', { session: false }), UserController.remove);     // D
router.post('/users/login', UserController.login);

// router.post('/companies', passport.authenticate('jwt', { session: false }), CompanyController.create);                  // C
// router.get('/companies', passport.authenticate('jwt', { session: false }), CompanyController.getAll);                  // R

// router.get('/companies/:company_id', passport.authenticate('jwt', { session: false }), custom.company, CompanyController.get);     // R
// router.put('/companies/:company_id', passport.authenticate('jwt', { session: false }), custom.company, CompanyController.update);  // U
// router.delete('/companies/:company_id', passport.authenticate('jwt', { session: false }), custom.company, CompanyController.remove);  // D

// router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard)


// //branches
// router.post(
//   "/posts",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.create
// ); // C
// router.get(
//   "/posts",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.get
// ); // R



// router.put(
//   "/posts/:id",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.update
// ); // U
// router.delete(
//   "/posts/:id",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.remove
// ); // D

// //branches
router.post(
  "/group",
  passport.authenticate("jwt", { session: false }),
  uploadVendor.single("myImage"),
  GroupController.create
); // C+
// router.post(
//   "/saveExp",
//   passport.authenticate("jwt", { session: false }),
//   // uploadVendor.single("myImage"),
//   GroupController.saveExp
// ); // C+
// router.post(
//   "/settleExp",
//   passport.authenticate("jwt", { session: false }),
//   // uploadVendor.single("myImage"),
//   GroupController.settleExp
// ); // C+
// router.get(
//   "/allgroup",
//   passport.authenticate("jwt", { session: false }),
//   GroupController.get
// ); // R
// router.get(
//   "/groupData/:id",
//   passport.authenticate("jwt", { session: false }),
//   GroupController.groupData
// ); // R
// router.get(
//   "/group",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.get
// ); // R
// router.get(
//   "/allOweData",
//   passport.authenticate("jwt", { session: false }),
//   GroupController.allOweData
// ); // R
// router.get(
//   "/recentActivity",
//   passport.authenticate("jwt", { session: false }),
//   GroupController.recentActivity
// ); // R

// router.put(
//   "/group/:id",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.update
// ); // U
// router.put(
//   "/groupActive/:id",
//   // passport.authenticate("jwt", { session: false }),
//   GroupController.groupActive
// ); // U
// router.delete(
//   "/group/:id",
//   // passport.authenticate("jwt", { session: false }),
//   PostController.remove
// ); // D
// var storage = multer.diskStorage({

//   destination: function (req, file, callback) {
//     callback(null, 'public/uploads');
//   },
//   // filename: function (req, file, callback) {
//   //   callback(null, file.fieldname + '-' + Date.now());
//   // }
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   }
// });
// var upload = multer({ storage: storage }).single('myImage');
// // vendors


// // router.post('/uploads', function (req, res) {
// //   console.log('req')
// //   uploadVendor.single("myImage"),
// //     // passport.authenticate("jwt", { session: false }),
// //     uploadController.create
// //   // console.log(res)
// //   // console.log(req)

// //   upload(req, res, function (err) {
// //     if (err) {
// //       return res.end("Error uploading file.");
// //     }
// //     res.end("File is uploaded");
// //   });
// // });
// router.post(
//   "/uploads",
//   uploadVendor.single("myImage"),
//   //     // passport.authenticate("jwt", { session: false }),
//   uploadController.create
// ); // A

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
