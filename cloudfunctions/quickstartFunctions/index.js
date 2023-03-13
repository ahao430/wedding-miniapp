const cloud = require('wx-server-sdk') // 云开发服务端SDK引入
cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database() // 取出数据库操作对象
const name = 'message' // 该模版的标识

exports.main = async (event, context) => {
  // 预置创建集合，如果存在则自动失败跳过，自己上架时可以去掉
  try{ 
    await db.createCollection('message') 
    await db.createCollection('config') 
  }catch(e){}
  
  const wxContext = cloud.getWXContext() // 获取微信上下文

  if (event.type === 'getlist') { // 如果行为是get
    const data = (await db.collection('message').get()).data // 取出data
    return {data}
  }
  if (event.type === 'add') { // 如果行为是add
    await db.collection('message').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: event.data
    })
    return {data:true}
  }

  if (event.type === 'getConfig') { // 如果行为是get
    const data = (await db.collection('config').get()).data[0] // 取出data
    return {data}
  }

  return {data:false}
}
