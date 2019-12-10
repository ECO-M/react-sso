/**
 * roleManagement 角色列表
 * page 当前页
 * pageSize 条数
 * @type {*|void}
 */

const databaseConnect = require('../../mongodb/databaseConnection');
const jwt = require('jsonwebtoken');
const roleManagement = databaseConnect.roleManagement;
const router = require('koa-router')();
router.post('/', async (ctx, next) => {
  try {
    //token 验证(过期,是否登陆)
    let tokenErr = jwt.verify(ctx.request.header.authorization, 'token', (err, authData) => {
      return err;
    });
    if (tokenErr) {
      ctx.response.body = {
        error: true,
        code: '401',
        message: '请重新登陆',
      };
      return false;
    }
    ctx.status = 200;
    let dataList = [], _filter, {page, pageSize, roleName = ''} = ctx.request.body;
    /**
     * 模糊查询
     * 查询条件 _filter
     * dataList 每页条数
     * total 总条数
     * @type {{$or: {roleName: {$regex: string}}[]}}
     * @private
     */
    _filter = {
      $or: [
        {roleName: {'$regex': roleName}}
      ]
    };
    const total = await roleManagement.countDocuments(_filter);
    const arr = await roleManagement.find(_filter).skip((page - 1) * pageSize).limit(pageSize).sort({'_id': -1}).exec();
    for (let i = 0, len = arr.length; i < len; i++) {
      dataList.push(
        {
          _id: arr[i]._id,
          userName: arr[i].userName,
          roleName: arr[i].roleName,
          iphone: arr[i].iphone,
          store: arr[i].store,
          status: arr[i].status,
          sex: arr[i].sex,
        }
      );
    }
    ctx.response.body = {
      code: 200,
      list: dataList,
      total: total
    };
    next();
  } catch (error) {
    ctx.response.body = {
      error: true,
      code: '00000',
      message: '服务器异常',
    }
  }
});

module.exports = router;
