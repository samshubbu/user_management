var mysql=require('mysql');
var con=mysql.createConnection({
    host:'localhost',
    user:'myusername',
    password:'lf553iR7VuE4XM8N'
});

con.connect(function(err){
    if(err) throw err;
    console.log('connected');
});