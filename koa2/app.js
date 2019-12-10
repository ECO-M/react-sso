/**
 * 开始搭建koa2
 * bodyparser 请求报文的处理
 * koa-router 路由中间件
 * koa2-cors  跨域,解决OPTIONS请求
 * @type {module.Application}
 */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('koa-router')();
const cors = require('koa2-cors');

/**
 * 实例化 new Koa()
 * @type {module.Application}
 */
const app = new Koa();

/**
 * app.use 将给定的中间件方法添加到此应用程序
 * cors，bodyparser，router
 * 详细信息请访问koa官网 'https://koa.bootcss.com/'
 */
app.use(bodyparser());

/**
 * cors 处理跨域请求
 * origin 配置Access-Control-Allow-Origin CORS标头。预计一个字符串。也可以设置为一个函数，该函数以ctx作为第一个参数
 * exposeHeaders 配置Access-Control-Expose-Headers CORS标头。期望以逗号分隔的数组。
 * maxAge 配置访问Access-Control-Max-AgeCORS标头,预计一个数字
 * credentials 配置Access-Control-Allow-Credentials CORS标头。需要一个布尔值。
 * allowMethods 配置Access-Control-Allow-Methods CORS标头。需要一个逗号分隔的数组，如果未指定，则默认的allowMethods为['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']。
 * allowHeaders 配置Access-Control-Allow-Headers CORS标头。期望以逗号分隔的array。如果未指定，则默认为反映在请求的Access-Control-Request-Headers标头中指定的标头。
 */
app.use(cors({
  origin: function (ctx) {
    if (ctx.url !== '/') {
      return '*';
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

/**
 * 请求错误机制处理
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
//
// const handler = async (ctx, next) => {
//   try {
//     await next();
//   } catch (error) {
//     ctx.response.body = {
//       error: true,
//       code: '00000',
//       message: '服务器异常',
//       desc: error.message
//     }
//   }
// };

/**
 * router(路由接口)
 * 登陆 login
 * 注册 register
 * 首页 home
 * 新增角色 addRole
 * 修改角色 editRole
 * 删除角色 deleteRole
 * 角色列表 roleManagement
 */

const login = require('./router/login.js');
router.use('/login', login.routes());

const register = require('./router/register.js');
router.use('/register', register.routes());

const addRole = require('./router/addRole.js');
router.use('/addRole', addRole.routes());

const editRole = require('./router/editRole.js');
router.use('/editRole', editRole.routes());

const deleteRole = require('./router/deleteRole.js');
router.use('/deleteRole', deleteRole.routes());

const roleManagement = require('./router/roleManagement.js');
router.use('/roleManagement', roleManagement.routes());
//
// const home = require('./router/home.js');
// router.use('/home', home);
//


app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

module.exports = app;
