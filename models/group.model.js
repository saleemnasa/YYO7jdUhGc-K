const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('group', {
        group_photo: DataTypes.STRING,
        group_photo_name: DataTypes.STRING,
        group_member: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        status: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 1 }
    });

    Model.associate = function (models) {
        Model.hasMany(models.group_lists, {
            foreignKey: "groupId",
            constraints: false,
            as: "groupListData"
        });
        Model.hasMany(models.group_expenses, {
            foreignKey: "groupId",
            constraints: false,
            as: "groupExpData"
        });
    }

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};