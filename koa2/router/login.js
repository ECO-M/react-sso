/**
 * login 登陆
 * interface
 * bcrypt has加密
 * node-forge RSA 加密
 * @type {*|void}
 */
const bcrypt = require('bcrypt');
const forge = require('node-forge');
const databaseConnect = require('../../mongodb/databaseConnection');
const jwt = require('jsonwebtoken');
const Login = databaseConnect.Login;
const roleManagement = databaseConnect.roleManagement;
const router = require('koa-router')();
router.post('/', async (ctx, next) => {
  try {
    ctx.status = 200;
    let {account, password} = ctx.request.body;
    /**
     * node-forge RSA 私钥
     * @type {string}
     */
    const privateKey = '-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKoz6X1lbLUWu3p9\n6UUUuZ9k2WxVtTV0qkXxHHzcW0oKzO07mT+JXk30Ft8cVSD1jjRv8QraP8E9zXGU\ntgAcxefrnrdcLBngi4LG987DP2pP2CQoHGQjlvSueKSRJZMaUkSTY91ns+VzvcVr\n5vHc++4q8x1wpa93zT6+335v/uGvAgMBAAECgYArxUnou6qnL39rUvIol9ncyfy4\nRZpicuxPLGCdI7Y+ZmSpJciVdGhSN9Gh8xFZdozpo1gj6Fi5A4HQEeR0RvIF9Rgh\nERblj1rRWqxPcsIddOO9VaknQPICWKqEW9+E1bEcyNUblCHA4LGyQwmuEFUb/Tkj\nxAghIHuEBCe0GFiVwQJBAN5i5QSoOIpdFHA0c981E4VhHc/muXwjx1HfE1pcuuFb\nTy3OwEoZdFp3LIjBnBkPRneLTNjo5WTIwrmfsy6VDF8CQQDD7c6d/nKiJwIESlr+\n/idqXAPNR/iS1YX3Nqtk9jgrgf5zULHr2nbk7MDas5S9Z9XPdUmxtnP44dhoGvDk\nzyyxAkB7XBxyQuZqSkvGGjKUhJq5iC/DXddSd35fegEARSQdUktPu7qK4Cfc7vKz\nQcLXW9PZCFqukDJ/f6YU1fPNSTy9AkADQ78hms/GK+g4shR6EzoM56OYlA5sQ+qL\nh/mrIP8mmm/m8/1C9MzuW5OLEVr1HPnPDyE/OM8N4pV8hpZk+Z7BAkEAzaFstazA\nxLzZOBWhvOzzo722glZ7HVezhMocLu7Y3EOXP/nbx09JpU3U7Egp5UVp0aiknh/Q\nez4Cc4ksMedxdA==\n-----END PRIVATE KEY-----\n';
    const privateK = forge.pki.privateKeyFromPem(privateKey);
    const decrypted = privateK.decrypt(password, 'RSA-OAEP');
    const user = {
      'jti': 1,
      "iss": "eco",
      "user": account
    };
    if (account === 'admin') {
      next();
    } else {
      const roleStatus = await roleManagement.findOne({userName: account});
      if (roleStatus.status === 2) {
        ctx.response.body = {
          error: true,
          code: '400',
          message: '此账号已被禁用，请联系管理员！'
        };
        return false;
      }
    }
    await Login.findOne({username: account}, (err, doc) => {
      if (!doc) {
        ctx.response.body = {
          error: true,
          code: '401',
          message: '用户名或密码错误！'
        }
      } else {
        /**
         * 检查密码是否匹配
         * bcrypt.compareSync(password,doc.password);
         */
        const pwdMatch = bcrypt.compareSync(decrypted, doc.password);
        if (pwdMatch) {
          /**
           * jwt (jsonwebtoken)
           * set token expiresIn(xx day queen expire)
           */
          jwt.sign(user, "token", {expiresIn: '3day'}, (err, token) => {
            let data = {
              username: doc.username,
              phone: doc.iphone,
              sex: doc.sex,
              avatar: doc.avatar,
              route: doc.route
            };
            ctx.body = {
              code: 200,
              data: {
                token: token,
                data: data,
                message: '登陆成功！'
              }
            };
          });
          next();
        } else {
          ctx.response.body = {
            error: true,
            code: '401',
            message: '用户名或密码错误！'
          };
        }
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      ctx.response.body = {
        error: true,
        code: '00000',
        message: '用户名已存在！',
      }
    } else {
      ctx.response.body = {
        error: true,
        code: '00000',
        message: '服务器异常',
      }
    }
  }
});

module.exports = router;
