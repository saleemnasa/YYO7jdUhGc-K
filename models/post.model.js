const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('posts', {
        title: DataTypes.STRING,
        address: DataTypes.TEXT,
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