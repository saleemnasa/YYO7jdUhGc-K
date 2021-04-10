const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('group_expenses', {
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "groups",
                key: "id"
            }
        },
        groupListId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "group_lists",
                key: "id"
            }
        },
        description: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        amount: DataTypes.STRING,
        status: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 1 }
    });

    Model.associate = function (models) {
        // Model.hasMany(models.User, {
        //     foreignKey: "groupId",
        //     constraints: false,
        //     as: "User"
        // });
        Model.belongsTo(models.User, {
            foreignKey: "user_id",
            constraints: false,
            as: "userData"
        });
    }

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};