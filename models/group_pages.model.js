const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('group_pages', {
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "groups",
                key: "id"
            }
        },
        name: DataTypes.STRING,
        amount: DataTypes.DECIMAL(10, 2),
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