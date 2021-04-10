const { posts, User } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");
const Sequelize = require('sequelize');
const create = async function (req, res) {
    let body = {};
    body = req.body;
    console.log(body, 'body')
    // let user = req.user;
    // body["createdBy"] = user.id;
    await to(
        posts.create(body).then(function (item) {
            res.json(item);
        }).catch(function (err) {
            // handle error;
            return ReS(res, { error: err })
        })
    );
};
module.exports.create = create;

const get = async function (req, res) {
    // let user = req.user;

    // if (user.toWeb()) {
    let activeData;
    [err, activeData] = await to(posts.findAll({
        order: [['id', 'DESC']],
        where: {
            status: 1
        }
    }));

    let inactiveData;
    [err, inactiveData] = await to(posts.findAll({
        order: [['id', 'DESC']],
        where: {
            status: 0
        }
    }));

    if (err) TE(err.message);
    return ReS(res, { activeData: activeData, inactiveData: inactiveData });
    // } else {
    //     let activeData;
    //     let inactiveData;
    //     return ReS(res, { activeData: activeData, inactiveData: inactiveData });
    // }
};
module.exports.get = get;

const update = async function (req, res) {
    const id = req.params.id;
    let body = {};
    body = req.body;
    // let user = req.user;
    // body["updatedBy"] = user.id;
    // body["CreateDate"] = new Date();
    // body["timeZone"] = 'America/New_York';
    await to(
        posts.find({
            where: { id: id }
        })
            .then(branches => {
                return branches.updateAttributes(body);
            })
            .then(updatedBranch => {
                res.json(updatedBranch);
            })
    );
};
module.exports.update = update;

const remove = async function (req, res) {
    let body = {};
    body['status'] = 0;
    await to(posts.find({
        where: {
            id: req.params.id
        }
    }).then(branches => {
        return branches.updateAttributes(body)
    })
        .then(updateStatus => {
            res.json(updateStatus);
        }));
}
module.exports.remove = remove;

const exportBranch = async function (req, res) {
    let user = req.user;

    if (user.toWeb()) {
        let branchData;
        [err, branchData] = await to(posts.findAll({

        }));

        if (err) TE(err.message);
        return ReS(res, { branches: branchData });
    } else {
        let branchData;
        return ReS(res, { branches: branchData });
    }
    //return ReS(res, {user:user.toWeb()});
}
module.exports.exportBranch = exportBranch;

const branchActive = async function (req, res) {
    let body = {};
    body['status'] = 1;
    await to(posts.find({
        where: {
            id: req.params.id
        }
    }).then(gta => {
        return gta.updateAttributes(body)
    })
        .then(updateStatus => {
            res.json(updateStatus);
        }));
}
module.exports.branchActive = branchActive;

const brancheDelete = async function (req, res) {
    posts.destroy({
        where: {
            id: req.params.id
        }
    })
    return ReS(res);
}
module.exports.brancheDelete = brancheDelete;

const getCompanyBranchDetails = async function (req, res) {
    let user = req.user;
    let id = req.params.id;
    if (user.toWeb()) {
        let activeData;

        [err, activeData] = await to(posts.findAll({
            order: [['id', 'DESC']],
            where: {
                status: 1,
                companyId: id
            }
        }));



        if (err) TE(err.message);
        return ReS(res, { activeData: activeData });
    } else {
        let activeData;
        let inactiveData;
        return ReS(res, { activeData: activeData, inactiveData: inactiveData });
    }
};
module.exports.getCompanyBranchDetails = getCompanyBranchDetails;