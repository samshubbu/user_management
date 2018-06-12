

var mysql=require('mysql');
var con = mysql.createConnection({
    
    host : 'localhost',
    user : 'myusername',
    password : 'lf553iR7VuE4XM8N',
    database : 'student'
    
});

    con.connect(function(err){
        if(err) throw err;
        console.log('connected');
        con.query('select * FROM usertbl',function(err,result){
            if(err) throw err;
            console.log(result);
        });
    });