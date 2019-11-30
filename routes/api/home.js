let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
router.get('/',(req,res,next)=>{
  //res.setHeader('Access-Control-Allow-Origin',req.headers.origin)//一条允许
    console.log('home')
let _id = req.query._id
if(_id){
    getDetail(req,res,next,_id)
}else{
    //console.log('列表')
    let{_page,_sort,q,_limit} = req.query
    q = q ? {title:eval('/' + q + '/')} : {}
    mgdb({
        collectionName:'home',
        success:({collection,client}) =>{
            collection.find(q,{
               limit: _limit,
               skip: _limit * _page,
               sort:{[_sort]: -1}
            }).toArray((err,result)=>{
                if(err){
                    res.send({er:1,msg:'home集合操作错误'})
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
let getDetail = (req,res,next,_id) =>{
    mgdb({
        collectionName:'home',
        
        success:({collection,client,ObjectID}) =>{
            collection.find({
                _id:ObjectID(_id)
                
            },{
            }).toArray((err,result)=>{
                if(err){
                    res.send({err:1,msg:'home结合操作错误'})
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