const cloud = require('wx-server-sdk') // 云开发服务端SDK引入
cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database() // 取出数据库操作对象
const name = 'invite' // 该模版的标识
exports.main = async (event, context) => {
  // 预置创建集合，如果存在则自动失败跳过，自己上架时可以去掉
  try{ await db.createCollection('invite') }catch(e){}
  const wxContext = cloud.getWXContext() // 获取微信上下文
  if (event.type === 'get') { // 如果行为是get
    const data = (await db.collection('invite').where({ // 查找数据库集合文档
      _id: wxContext.OPENID || wxContext.FROM_OPENID // 文档ID为用户的openid
    }).get()).data // 取出data
    if (data.length !== 0) { // 如果取出来有值
      return {
				name,
				data:data[0].status // 返回记录的statxwus值
			}
    } else {
			return {
				name,
				data:0 // 没有的话，返回0-未提交xw
			}
    }
  }
  if (event.type === 'add') { // 如果行为是add
    await db.collection('invite').doc(wxContext.OPENID || wxContext.FROM_OPENID).set({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        tel: event.data.tel,
        people: event.data.people,
        retext: event.data.retext,
        status: 1 // 默认为1，1-审核中；2-同意；3-拒绝
      }
    })
    return {
			name,
			data:true // 返回成功
		}
  }
  return {
		name,
		data:false // 没有处理方法，则false
	}
}
