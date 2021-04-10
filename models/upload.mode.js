const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('upload', {
        userPhoto: DataTypes.STRING,
        // group_list: DataTypes.STRING,
        status: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 1 }
    });

    // Model.associate = function (models) {
    //     this.Users = this.belongsToMany(models.User, { through: 'UserCompany' });
    // };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};