const { TE, to } = require('../../services/util.service');


const mongoose = require("mongoose")
const validator = require('mongoose-validator')
const {mongoConn} = require("./index")

// const conn = mongoose.createConnection(CONFIG.MONGOSTRING);

const groupSchema = new mongoose.Schema({
    group_photo: {type: String},
    group_photo_name: {type: String},
    group_member: {type: String},
    user_id: {type: Number },
    status: { type: Number, default: 1 } // add allownull false if possible
});

var Model = mongoConn.model('group', groupSchema);

// Model.associate = function (models) {
//     Model.hasMany(models.group_lists, {
//         foreignKey: "groupId",
//         constraints: false,
//         as: "groupListData"
//     });
//     Model.hasMany(models.group_expenses, {
//         foreignKey: "groupId",
//         constraints: false,
//         as: "groupExpData"
//     });
// }

Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
};



module.exports.group = Model
