const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('group_lists', {
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "groups",
                key: "id"
            }
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        invitation: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        status: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0 }
    });

    // Model.associate = function (models) {
    //     this.Users = this.belongsToMany(models.User, { through: 'UserCompany' });
    // };
    Model.associate = function (models) {
        Model.belongsTo(models.group, {
            foreignKey: "groupId",
            constraints: false,
            as: "groupData"
        });
        Model.hasMany(models.group_expenses, {
            foreignKey: "groupListId",
            constraints: false,
            as: "groupExpeData"
        });
    }
    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};