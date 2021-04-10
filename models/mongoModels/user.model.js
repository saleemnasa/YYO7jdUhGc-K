'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../../services/util.service');
const CONFIG = require('../../config/config');

const mongoose = require("mongoose")
const validator = require('mongoose-validator')
const { mongoConn } = require("./index")

// const conn = mongoose.createConnection(CONFIG.MONGOSTRING);

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  currency: { type: String },
  time: { type: Date },
  language: { type: String },
  email: { 
      type: String, 
      unique: true , 
      validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ], },
  phone: { 
      type: String, 
      unique: true , 
      minlength: 7,
      maxlength: 20,
      validate: {
          validator: function(v) {
            return !isNaN(v);
          },
          message: `not a valid phone number!`
        },
  },
  password: String,
  photo: String
});

userSchema.pre('save', async function(next) {
  // do stuff
  let err;
  console.log({this: this})
  let user = this
   //  if (user.changed('password')) {
        let salt, hash
        [err, salt] = await to(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(user.password, salt));
        if (err) TE(err.message, true);

        user.password = hash;
        console.log({user})
    // }
  next();
});

    var Model = mongoConn.model('User', userSchema);

    // Model.associate = function (models) {
    //     this.Companies = this.belongsToMany(models.Company, { through: 'UserCompany' });
    // };
        // Model.beforeSave(async (user, options) => {

    //     let err;
    //     if (user.changed('password')) {
    //         let salt, hash
    //         [err, salt] = await to(bcrypt.genSalt(10));
    //         if (err) TE(err.message, true);

    //         [err, hash] = await to(bcrypt.hash(user.password, salt));
    //         if (err) TE(err.message, true);

    //         user.password = hash;
    //     }
    // });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if (!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if (err) TE(err);

        if (!pass) TE('invalid password');

        return this;
    }

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

  module.exports.User = Model
