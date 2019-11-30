let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
router.get('/',(req,res,next)=>{
    console.log('cloumn')
let id = req.query._id
if(id){
    getDetail(req,res,next,id)
}else{
    console.log('列表')
    let{page,sort,q,limit} = req.query
    q = q ? {title:eval('/' + q + '/')} : {}
    mgdb({
        collectionName:'banner',
        success:({collection,client}) =>{
            collection.find(q,{
               limit: limit,
               skip: limit * page,
               sort:{[sort]: -1}
            }).toArray((err,result)=>{
                if(err){
                    res.send({er:1,msg:'banner集合操作错误'})
                }else{
                    res.send({err:0,data:result})
                }
                
            })
        }
    })
    }
});
router.get('/:id',(req,res,next)=>{
    getDetail(req,res,next,req.params.id)
});
let getDetail = (req,res,next,id) =>{
    mgdb({
        collectionName:'banner',
        success:({collection,client,ObjectID}) =>{
            collection.find({
                id:ObjectID(id)
            },{
            }).toArray((err,result)=>{
                if(err){
                    res.send({err:1,msg:'banner结合操作错误'})
                }else{
                    if(result.length>0){
                        res.send({err:0,data:result[0]})
                    }else{
                        res.send({err:1,msg:'错误的id或者数据不存在'})
                    }
                }
            })
        }
    })
}
module.exports=router