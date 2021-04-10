// const { posts, User, group, group_lists, group_expenses, sequelize } = require("../models");
const { group } = require("../models/mongoModels/group.model");
const { to, ReE, ReS } = require("../services/util.service");
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

const create = async function (req, res) {
    var body = req.body;
    var groupList = JSON.parse(body.group)
    var file = req.file;
    let user = req.user;
    let groupObj = {};
    if (file) {
        groupObj['group_photo'] = file.originalname;
        groupObj['group_photo_name'] = file.filename;
    }
    groupObj['group_member'] = groupList.group_name;
    groupObj['user_id'] = user.id;
    groupObj['status'] = 1;
    var childArr = groupList.group_list;
    console.log(groupObj, 'groupObj', childArr)

    let groupData;
    [err, groupData] = await to(group.create(groupObj).then(async function (todo) {
        // res.json(todo);
        let data = JSON.stringify(todo);
        jsonData = JSON.parse(data);
        var groupId = jsonData.id;
        const element = {};
        element['groupId'] = groupId;
        element['name'] = user.firstName;
        element['status'] = 2;
        element['email'] = user.email;
        element['user_id'] = user.id;
        element['invitation'] = 'owner';
        await group_lists.create(element)
        for (let i = 0; i < childArr.length; i++) {
            // const element = {};
            element['groupId'] = groupId;
            element['name'] = childArr[i].name;
            element['status'] = 1;
            element['email'] = childArr[i].email;
            element['user_id'] = user.id;
            element['invitation'] = 'member';
            await group_lists.create(element)
        }
    }));
    if (err) TE(err.message);
    return ReS(res, { data: groupData });
};
module.exports.create = create;


// const saveExp = async function (req, res) {
//     let body = {};
//     body = req.body;
//     console.log(body, 'body')
//     let user = req.user;
//     var bodyData = {};
//     bodyData["user_id"] = user.id;
//     bodyData["description"] = body.description;
//     bodyData["groupId"] = body.groupId;
//     var groupListData = body.groupListData.filter(element => user.email != element.email);

//     if (groupListData.length > 0) {
//         for (let index = 0; index < groupListData.length; index++) {
//             const element = groupListData[index];
//             // if (user.email == element.email) {
//             bodyData["amount"] = Number(body.amount) / groupListData.length;
//             bodyData["groupListId"] = element.id;
//             await to(
//                 group_expenses.create(bodyData).then(function (item) {
//                     res.json(item);
//                 }).catch(function (err) {
//                     // handle error;
//                     return ReS(res, { error: err })
//                 })
//             );
//             // }
//         }
//     }
// };
// module.exports.saveExp = saveExp;
// const get = async function (req, res) {
//     let user = req.user;

//     // if (user.toWeb()) {
//     let activeData;
//     [err, activeData] = await to(group.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 1,
//             // user_id: user.id,
//             [Op.or]: [
//                 {
//                     user_id: user.id
//                 },
//                 {
//                     [Op.and]: [
//                         // Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//                         Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//                         Sequelize.where(Sequelize.col('groupListData.email'), '=', user.email,),
//                     ]
//                 }
//             ]
//         },
//         include: [
//             {
//                 model: group_lists,
//                 as: "groupListData",
//                 include: [
//                     {
//                         model: group_expenses,
//                         as: "groupExpeData",
//                         required: false,
//                         where: {
//                             status: 1,
//                         }
//                     },
//                 ],
//                 where: {
//                     status: 2,
//                 }, required: false
//             },
//             {
//                 model: group_expenses,
//                 as: "groupExpData",
//                 where: {
//                     status: 1,
//                 }, required: false
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     let requestData;
//     [err, requestData] = await to(group.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 1,
//             // user_id: user.id
//         },
//         include: [
//             {
//                 model: group_lists,
//                 as: "groupListData",
//                 where: {
//                     email: user.email,
//                     status: 1
//                 }
//             },
//             {
//                 model: group_expenses,
//                 as: "groupExpData"
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     let inactiveData;
//     [err, inactiveData] = await to(group.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 0
//         }
//     }));

//     if (err) TE(err.message);
//     return ReS(res, { activeData: activeData, inactiveData: inactiveData, requestData: requestData });
//     // } else {
//     //     let activeData;
//     //     let inactiveData;
//     //     return ReS(res, { activeData: activeData, inactiveData: inactiveData });
//     // }
// };
// module.exports.get = get;
// const allOweData = async function (req, res) {
//     let user = req.user;

//     // if (user.toWeb()) {

//     let owedData;
//     [err, owedData] = await to(group_lists.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 2,
//             // user_id: user.id
//         },
//         include: [
//             //     {
//             //         model: group_lists,
//             //         as: "groupListData",
//             //         where: {
//             //             email: user.email,
//             //             status: 1
//             //         }
//             //     },
//             {
//                 model: group_expenses,
//                 as: "groupExpeData",
//                 where: {
//                     status: 1,
//                     user_id: user.id
//                 }
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     let oweData;
//     [err, oweData] = await to(group_lists.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 2,
//             email: user.email,
//             // [Op.or]: [
//             //     {
//             //         user_id: user.id
//             //     },
//             //     {
//             //         [Op.and]: [
//             //             // Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//             //             Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//             //             Sequelize.where(Sequelize.col('groupListData.email'), '=', user.email,),
//             //         ]
//             //     }
//             // ]
//         },
//         include: [
//             //     {
//             //         model: group_lists,
//             //         as: "groupListData",
//             //         where: {
//             //             status: 2,
//             //         }, required: false
//             //     },
//             {
//                 model: group_expenses,
//                 as: "groupExpeData",
//                 where: {
//                     status: 1,
//                     // user_id: user.id
//                 },
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     // let inactiveData;
//     // [err, inactiveData] = await to(group.findAll({
//     //     order: [['id', 'DESC']],
//     //     where: {
//     //         status: 0
//     //     }
//     // }));

//     if (err) TE(err.message);
//     return ReS(res, { oweData: oweData, owedData: owedData });
//     // } else {
//     //     let activeData;
//     //     let inactiveData;
//     //     return ReS(res, { activeData: activeData, inactiveData: inactiveData });
//     // }
// };
// module.exports.allOweData = allOweData;
// const recentActivity = async function (req, res) {
//     let user = req.user;

//     // if (user.toWeb()) {

//     let owedData;
//     [err, owedData] = await to(group_lists.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 2,
//             // user_id: user.id
//         },
//         include: [
//             //     {
//             //         model: group_lists,
//             //         as: "groupListData",
//             //         where: {
//             //             email: user.email,
//             //             status: 1
//             //         }
//             //     },
//             {
//                 model: group_expenses,
//                 as: "groupExpeData",
//                 include: [
//                     {
//                         model: User,
//                         as: "userData"
//                     },],
//                 where: {
//                     status: 1,
//                     user_id: user.id
//                 }
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     let oweData;
//     [err, oweData] = await to(group_lists.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             // status: 2,
//             // email: user.email,
//             [Op.or]: [
//                 {
//                     email: user.email,
//                 },
//                 // {
//                 // [Op.and]: [
//                 // Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//                 // Sequelize.where(Sequelize.col('groupListData.status'), '=', 2),
//                 Sequelize.where(Sequelize.col('groupExpeData.user_id'), '=', user.id,),
//                 // ]
//                 // }
//             ]
//         },
//         include: [
//             {
//                 model: group,
//                 as: "groupData",
//                 // where: {
//                 //     status: 2,
//                 // }, required: false
//             },
//             {
//                 model: group_expenses,
//                 as: "groupExpeData",
//                 include: [
//                     {
//                         model: User,
//                         as: "userData"
//                     },],
//                 // where: {
//                 //     // status: 1,
//                 //     // user_id: user.id
//                 // },
//             },
//         ],
//     }));
//     if (err) TE(err.message);
//     // let inactiveData;
//     // [err, inactiveData] = await to(group.findAll({
//     //     order: [['id', 'DESC']],
//     //     where: {
//     //         status: 0
//     //     }
//     // }));

//     if (err) TE(err.message);
//     return ReS(res, { oweData: oweData });
//     // } else {
//     //     let activeData;
//     //     let inactiveData;
//     //     return ReS(res, { activeData: activeData, inactiveData: inactiveData });
//     // }
// };
// module.exports.recentActivity = recentActivity;
// const groupData = async function (req, res) {
//     let user = req.user;
//     // if (user.toWeb()) {
//     let activeData;
//     [err, activeData] = await to(group.find({
//         order: [['id', 'DESC']],
//         where: {
//             id: req.params.id,
//         },
//         include: [
//             {
//                 model: group_lists,
//                 as: "groupListData",
//                 where: {
//                     status: 2,
//                     // email: {
//                     //     [Op.ne]: user.email
//                     // },
//                 }, include: [
//                     {
//                         model: group_expenses,
//                         as: "groupExpeData",
//                         include: [
//                             {
//                                 model: User,
//                                 as: "userData"
//                             },]
//                     },]
//             },
//             // {
//             //     model: group_expenses,
//             //     as: "groupExpData"
//             // },
//         ],
//     }));
//     if (err) TE(err.message);
//     // if (err) TE(err.message);
//     return ReS(res, { activeData: activeData });
//     // } else {
//     //     let activeData;
//     //     let inactiveData;
//     //     return ReS(res, { activeData: activeData, inactiveData: inactiveData });
//     // }
// };
// module.exports.groupData = groupData;
// const groupActive = async function (req, res) {
//     let body = {};
//     body['status'] = req.body.status;
//     await to(group_lists.find({
//         where: {
//             id: req.params.id
//         }
//     }).then(gta => {
//         return gta.updateAttributes(body)
//     })
//         .then(updateStatus => {
//             res.json(updateStatus);
//         }));
// }
// module.exports.groupActive = groupActive;
// const update = async function (req, res) {
//     const id = req.params.id;
//     let body = {};
//     body = req.body;
//     // let user = req.user;
//     // body["updatedBy"] = user.id;
//     // body["CreateDate"] = new Date();
//     // body["timeZone"] = 'America/New_York';
//     await to(
//         posts.find({
//             where: { id: id }
//         })
//             .then(branches => {
//                 return branches.updateAttributes(body);
//             })
//             .then(updatedBranch => {
//                 res.json(updatedBranch);
//             })
//     );
// };
// module.exports.update = update;
// const settleExp = async function (req, res) {
//     let body = {};
//     var ids = req.body.expArray;
//     console.log(ids);
//     body['status'] = 2;
//     console.log(ids)
//     for (let i = 0; i < ids.length; i++) {
//         const element = ids[i];
//         console.log(element, body);
//         await to(group_expenses.find({
//             where: {
//                 id: element
//             }
//         }).then(gta => {
//             return gta.updateAttributes(body)
//         }));
//     }
//     return ReS(res);
// }
// module.exports.settleExp = settleExp;

// const remove = async function (req, res) {
//     let body = {};
//     body['status'] = 0;
//     await to(posts.find({
//         where: {
//             id: req.params.id
//         }
//     }).then(branches => {
//         return branches.updateAttributes(body)
//     })
//         .then(updateStatus => {
//             res.json(updateStatus);
//         }));
// }
// module.exports.remove = remove;

// const exportBranch = async function (req, res) {
//     let user = req.user;

//     if (user.toWeb()) {
//         let branchData;
//         [err, branchData] = await to(posts.findAll({

//         }));

//         if (err) TE(err.message);
//         return ReS(res, { branches: branchData });
//     } else {
//         let branchData;
//         return ReS(res, { branches: branchData });
//     }
//     //return ReS(res, {user:user.toWeb()});
// }
// module.exports.exportBranch = exportBranch;

// const branchActive = async function (req, res) {
//     let body = {};
//     body['status'] = 1;
//     await to(posts.find({
//         where: {
//             id: req.params.id
//         }
//     }).then(gta => {
//         return gta.updateAttributes(body)
//     })
//         .then(updateStatus => {
//             res.json(updateStatus);
//         }));
// }
// module.exports.branchActive = branchActive;

// const brancheDelete = async function (req, res) {
//     posts.destroy({
//         where: {
//             id: req.params.id
//         }
//     })
//     return ReS(res);
// }
// module.exports.brancheDelete = brancheDelete;

// const getCompanyBranchDetails = async function (req, res) {
//     let user = req.user;
//     let id = req.params.id;
//     if (user.toWeb()) {
//         let activeData;

//         [err, activeData] = await to(posts.findAll({
//             order: [['id', 'DESC']],
//             where: {
//                 status: 1,
//                 companyId: id
//             }
//         }));



//         if (err) TE(err.message);
//         return ReS(res, { activeData: activeData });
//     } else {
//         let activeData;
//         let inactiveData;
//         return ReS(res, { activeData: activeData, inactiveData: inactiveData });
//     }
// };
// module.exports.getCompanyBranchDetails = getCompanyBranchDetails;

// const allgroup = async function (req, res) {
//     // let user = req.user;

//     // if (user.toWeb()) {
//     let activeData;
//     [err, activeData] = await to(group.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 0
//         }
//     }));

//     let inactiveData;
//     [err, inactiveData] = await to(group.findAll({
//         order: [['id', 'DESC']],
//         where: {
//             status: 1
//         }
//     }));

//     if (err) TE(err.message);
//     return ReS(res, { activeData: activeData, inactiveData: inactiveData });

// };
// module.exports.allgroup = allgroup;