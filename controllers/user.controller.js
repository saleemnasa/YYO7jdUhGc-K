const { User } = require('../models/mongoModels/user.model');
const authService = require('../services/auth.service');
const { to, ReE, ReS } = require('../services/util.service');
// var Sequelize = require("sequelize");
// const Op = Sequelize.Op;

const create = async function (req, res) {
    const body = req.body;

    if (!body.unique_key && !body.email && !body.phone) {
        return ReE(res, 'Please enter an email or phone number to register.');
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.');
    } else {
        let err, user;
        
        [err, user] = await to(authService.createUser(body));

        if (err) return ReE(res, err, 422);
        // return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
        return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
    }
}
module.exports.create = create;

const get = async function (req, res) {
    let user = req.user;

    return ReS(res, { user: user.toWeb() });
}
module.exports.get = get;

const update = async function (req, res) {
    let err, user, data
    let id = req.params.id
    data = req.body;
    user = JSON.parse(data.user);
    var file = req.file;
    if (file) {
        user['photo'] = file.originalname;
    }
    return true
    let userfinddata;
    [err, userfinddata] = await to(
        User.find({
            where: {
                email: user.email,
                id: {
                    [Op.ne]: id
                },
            }
        })
    );
    // console.log(userfinddata)
    if (userfinddata) {
        // console.log(userfinddata)
        return ReS(res, { message: 'Email already exist ' + user.email, status: false });
    } else {
        var jsonData;
        [err, rateDatas] = await to(
            User.find({
                where: {
                    id: id
                }
            }).then(users => {
                return users.updateAttributes(user);
            })
                .then(jsonData1 => {
                    let data = JSON.stringify(jsonData1);
                    jsonData = JSON.parse(data);
                })
        );

        // [err, user] = await to(user.save());
        if (err) {
            if (err.message == 'Validation error') err = 'The email address or phone number is already in use';
            return ReE(res, err);
        }
        return ReS(res, { message: 'Updated User: ' + user.email, userData: jsonData, status: true });
    }

}
module.exports.update = update;

const remove = async function (req, res) {
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if (err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, { message: 'Deleted User' }, 204);
}
module.exports.remove = remove;


const login = async function (req, res) {
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if (err) return ReE(res, err, 422);

    return ReS(res, { token: user.getJWT(), user: user.toWeb() });
}
module.exports.login = login;