let express = require('express')
let router = express.Router()
let http = require('http')
router.get('/',(req,res,next)=>{
    let options = {
        hostname:'v.juhe.cn',
        port:80,
        path:`/toutiao/index?type=&key=55f8053eba54dab5a301a00f45523164`,
        method:'GET'
    }
    let reqHttp = http.request(options,(resHttp)=>{
        let str = ''
        resHttp.on('data',(chunk) =>{str+=chunk})
        resHttp.on('end',()=>{
            res.send(JSON.parse(str))
        })
    })
    reqHttp.on('error',(err)=>{console.log(err)})
    reqHttp.end()
   
})
module.exports = router;