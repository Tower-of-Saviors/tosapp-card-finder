const crawler = require('./crawler');

let acc = 'ACCOUNT';
let pw = 'PASSWORD';

var searchItem = '孫策';

crawler.login(acc, pw).then(crawler.search(searchItem, result => console.log(result)))