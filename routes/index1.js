var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public/images");
     },
     filename: function(req, file, callback) {
         callback(null, file.originalname);
     }
 });
var upload = multer({ storage : storage}).single('myfile'); 


var mysql = require('mysql');
    var con = mysql.createConnection({
        host : 'localhost',
        user : 'myusername',
        password : '123456789',
        database : 'student'
    });
    
    con.connect(function(err){
        if(err) throw err;
        console.log('connected');
    });

router.get('/loggedin',function(req,res){

    res.render('project/loginform',{title: 'Login Page'});
            
    });

router.get('/edituser',function(req,res){
    
    var id=req.query.id;
  
    
    var edit = "select * from sam where id="+id;
    con.query(edit,function(err,result){
       if(err) throw err;
        
         res.render('project/edituser',{ editres : result[0]} );
    });
});

router.post('/edit',function(req,res){
    
      upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }
    
    var id=req.body.id;
    var name=req.body.name;
    var address=req.body.address;
    var photo=req.file.filename;
  
    
    var edit="update sam set name='"+name+"',address='"+address+"', photo='"+photo+"' where id="+id;
    con.query(edit,function(err,result){
       if(err) throw err;
        
         res.render('project/details',{ editresult : result[0]} );
    });
});
});
    

   
            
    

router.post('/submitform',function(req,res){
    console.log("hhhhhhhhhhhhhhhhhhhhhhhh");
    
    res.render('project/details',{title: 'Login Page'});
            
        });

router.get('/getuserslist',function(req,res){
    console.log("11111111111111111111111");
    
    var getusers="select * from sam";
    con.query(getusers,function(err,result){
        if(err) throw err;
        console.log(result);
//       res.end( JSON.stringify(result));
        res.render('project/details',{result2: result});
        
    });
    
  });

router.post("/adduser",function(req,res){
    
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }
    
    var id=req.body.id;
    var name=req.body.name;
    var address=req.body.address;
    var photo=req.file.filename;
        console.log(photo);
     
    var aduser="insert into sam(id,name,address,photo) values('"+id+"','"+name+"','"+address+"','"+photo+"')";
    con.query(aduser,function(err,result){
        
        if(err) throw err;
        console.log(result);
        res.redirect("getuserslist");
    });
});
});

router.get('/deleteuser',function(req,res){
    
    var id=req.query.id;
    
   var deluser="delete from sam where id="+id;
    con.query(deluser,function(err,result){
        
        if(err) throw err;
        console.log(result);
        res.redirect("getuserslist");
    });
    
  });

module.exports = router;