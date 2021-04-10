const { upload, group, group_lists } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {
    // let user = req.user;
    var body = req.body;
    var groupList = JSON.parse(body.group)
    var file = req.file;
    let groupObj = {};
    if (file) {
        groupObj['group_photo'] = file.originalname;
        groupObj['group_photo_name'] = file.filename;
    }
    groupObj['group_member'] = groupList.group_name;
    var childArr = groupList.group_list;
    console.log(groupObj, 'groupObj', childArr)

    let groupData;
    [err, groupData] = await to(group.create(groupObj).then(function (todo) {
        // res.json(todo);
        let data = JSON.stringify(todo);
        jsonData = JSON.parse(data);
        var groupId = jsonData.id;
        for (let i = 0; i < childArr.length; i++) {
            const element = {};
            element['groupId'] = groupId;
            element['name'] = childArr[i].name;
            element['email'] = childArr[i].email;
            group_lists.create(element)
        }
    }));
    if (err) TE(err.message);
    return ReS(res, { data: groupData });

}
module.exports.create = create;

const getAll = async function (req, res) {
    let user = req.user;
    let err, companies;

    [err, companies] = await to(user.getCompanies({ include: [{ association: Company.Users }] }));

    let companies_json = []
    for (let i in companies) {
        let company = companies[i];
        let users = company.Users;
        let company_info = company.toWeb();
        let users_info = [];
        for (let i in users) {
            let user = users[i];
            // let user_info = user.toJSON();
            users_info.push({ user: user.id });
        }
        company_info.users = users_info;
        companies_json.push(company_info);
    }

    console.log('c t', companies_json);
    return ReS(res, { companies: companies_json });
}
module.exports.getAll = getAll;

const get = function (req, res) {
    let company = req.company;

    return ReS(res, { company: company.toWeb() });
}
module.exports.get = get;

const update = async function (req, res) {
    let err, company, data;
    company = req.company;
    data = req.body;
    company.set(data);

    [err, company] = await to(company.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, { company: company.toWeb() });
}
module.exports.update = update;

const remove = async function (req, res) {
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if (err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, { message: 'Deleted Company' }, 204);
}
module.exports.remove = remove;