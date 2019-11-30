let bcrypt = require('bcrypt')
let password = 'alex123'
var hash = bcrypt.hashSync(password,10)

console.log('加了盐',hash)
let bl = bcrypt.compareSync(password,hash)
//console.log(bl)