let mysql = require('mysql')
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test'
});
connection.connect()
//let sql = `select * from user1 where username="人人"` //查
//let sql = `DELETE FROM user1 WHERE username="小行"` //删
//let sql = `insert into user1(username,password)values('rere','123')`;//增
//let sql = `update user1 set username = 'renren' where username = '题人人'`
connection.query(sql, function(error,results){
    console.log(error,'error')
    console.log(results,'results')
    console.log('results',results.affectedRows)
    connection.end()         
})
