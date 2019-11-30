let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let mgdb = require('../../utils/mgdb')
let pathLib = require('path')
let fs = require('fs')
router.post('/', (req, res, next) => {
    console.log('reg')
    let { username, password, nikename } = req.body
    if (!username || !password) {
        res.send({ err: 1, msg: '用户名和密码不能为空' })
        return;
    }
    let time = Date.now()
    nikename = nikename || 'Lucky'
    let follow = 133;
    let fans =  2322
    let icon = ''
    password = bcrypt.hashSync(password, 10)
    if (req.files && req.files.length > 0) {
        fs.renameSync(
            req.files[0].path,
            req.files[0].path + pathLib.parse(req.files[0].originalname).ext
        )
        icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
    } else {
        icon = '/upload/noimage.png';
    }
    mgdb({
        collectionName:'user',
        success:({collection,client})=>{
            collection.find({
                username
            },{             
            }).toArray((err,result)=>{
                if(!err){
                    if(result.length>0){
                        res.send({err:1,msg:'用户名已存在'})
                        if(icon.indexOf('noimage') === -1){
                            fs.unlinkSync('./public'+icon)//判断注册失败删除上传的头像
                        }
                        client.close()
                    }else{
                        collection.insertOne({
                            username,password,nikename,fans,follow,time,icon
                        },(err,result)=>{
                           if(!err){
                            delete result.ops[0].password
                            res.send({err:0,msg:'注册成功',data:result.ops[0]})
                           }
                        })
                    }
                }else{
                    res.send({err:1,msg:'user集合操作失败'})
                    client.close()
                }
            })
        }
    })
})
module.exports = router