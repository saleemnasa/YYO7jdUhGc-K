'use strict';
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(__filename);
const db = {};
const CONFIG = require('../../config/config');

(async function(){
    db = await mongoose.connect(CONFIG.MONGOSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
})

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach((file) => {
//     let model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });


module.exports.mongoConn = mongoose.createConnection(CONFIG.MONGOSTRING);
