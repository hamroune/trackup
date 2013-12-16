
bcrypt = require('bcrypt');

var hash="$2a$10$SzWkpqeCp.8sLLzo/ULbbu8q2qwNtwCnI27BXQk90hVe5x7qJwCNm";
var pwd = "123456";

var cp = bcrypt.compareSync(pwd, hash);
console.log('cp', cp);