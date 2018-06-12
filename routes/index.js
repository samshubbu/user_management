var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
 

                   

//for sending email 
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "shubhamsinghrajput1996@gmail.com",
        pass: "swatisin"
    }                                       
 
});

 var storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public/images");
     },
     filename: function(req, file, callback) {
         callback(null, file.originalname);
     }
 });
                                                

 var mysql=require('mysql');
    var con = mysql.createConnection({
    
    // multipleStatements: true,
    host : 'localhost',
    user : 'myusername',
    password : '123456789',
    database : 'student'
    
});
    console.log("see this connection"+ con);

    con.connect(function(err){
        if(err) throw err;
        console.log('connected');
    });


router.all('*', function(req, res, next) {
    
    if(req.session.username || req.path==='/login' || req.path==='/' || req.path==='/deleteUser' || req.path=='/password-reset' || req.path=='/changepassword' || req.path==='/forgot' || req.path==='/adduser' || req.path==='/updateUser' || req.path==='/signup' || req.path==='/register' || req.path==='/forgot-password' || req.path==='/verify' || (req.path==='/loggedin' && req.method=='POST')){
        console.log(req.url);
//    console.log(req.method);
        if(req.url=='/login' && req.session.username)
            res.redirect('getUserlist');
        else
            next();
    }
    else{
        console.log("________________++++++++++++++++++++__________________++++++++++++++++++++_____________________");
        res.redirect('login');
    }
    
  
});

router.get('/logout', function(req, res, next) {
  
          
      req.session.destroy();
       req.flash('success','logout successfully')
  res.redirect('login');
});


router.get('/', function(req, res, next) {
   
  res.render('Homepage', { title: 'Sampress' });
});

//Forgot Password------------------------------
router.get('/forgot-password', function(req, res, next) {
   
  res.render('forgot-password');
});

router.post('/forgot',urlencodedParser, function(req, res, next) {
   
    var email = req.body.email;
    req.flash('success','Reset link has been sent to mail')
    res.redirect('login');
    
    var host = req.get('host');
        var link = "http://"+host+"/password-reset?email="+email;
//        
        var mailOptions={
            from:'shubhamsinghrajput1996@gmail.com',
            subject : "Reset Password",
            to : req.body.email,
            html : "Hello,<br><p> click on the click here to change your password<p>.<br><a href="+link+">click here</a>"
           }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, info){
                if(error){
                console.log(error);
                req.flash("Error","error Occured man Check some Errors and fixed them");
                }else{

                console.log("Message sent: " + info.response);
                res.end("sent");
                }
        });
    });
                                                                                                                                                    
router.get('/password-reset', function(req, res) {
    
    let email = req.query.email
    let sqlt = `select username from userlogin where email = ${email}`
    con.query(sqlt,function(err,result){
        if(err) throw err
        res.render('password-reset')
    })
    
})

router.post('/changepassword',function(req,res){
    
    let name = req.body.name;
    let password = req.body.password;
    let confirm = req.body.cpassword;
    if (password !== confirm){ req.flash('error','password does not match ');
    res.render('password-reset');
     }
    else
        var passwordchange = `update userlogin set password=${password} where username=${name}`;
        con.query(passwordchange,function(err,result){
           if(err) throw err;
            req.flash('success','Password reset successfully');
            res.redirect('login');
        })
})

/* GET Login page. */
router.get('/login', function(req, res, next) {
   
    res.render('user',{title : 'Login'});
}); 

/* GET to the next details page. */

router.post('/loggedin', function(req, res, next) {
    var name=req.body.user;
    var password=req.body.password;
    var verifyuser = 1;
   
 
    sql8="select * from userlogin where username='"+name+"' and password='"+password+"' and verified='"+verifyuser+"'";
    
    con.query(sql8,function(err,result){
        if(err) throw err;
        console.log(result.length);
        
        if(result.length==0){
            console.log('1234567898765432345678987654323456787654323456789876543234567876543');
            req.flash('error','username not exist');
            res.render('user',{title:'match not found'});
        }
        else{
            
            console.log(result.length);
            req.session.username = name;
            req.session.password = password;
            res.locals.username = req.session.username;
            res.locals.password = req.session.password;

        res.redirect('getuserlist');
        }
    })
});

router.get('/signup', function(req, res, next) {
    
    res.render('signup');
});

router.post('/useradd', function(req, res, next) {
    
    res.render('adduser');
});


router.post('/register',urlencodedParser, function(req, res, next) {
      
    var name=req.body.user;
    var password=req.body.password;
    var email=req.body.email;
   
    var result1="select username from userlogin where username='"+name+"'";
    con.query(result1,function(err,result){
        if (err) throw err;
        if(result.length!=0){
             req.flash('error','username already exists');
            res.redirect('login');
        }
        else{
            
                var user_registration="insert into userlogin(username,password,email) values('"+name+"', '"+password+"','"+email+"')";
                con.query(user_registration,function(err,result12){
                    if(err){
                       throw err;
                    } 
                    else{
//                      
                         req.flash('info','signup successfully you need to verify your Email to activate your account');
                        res.redirect('/login');
                    }
        
                })
        }
    });
    
    
 
    
        var host = req.get('host');
        var link = "http://"+host+"/verify?email="+email;
//        
        var mailOptions={
            from:'shubhamsinghrajput1996@gmail.com',
            subject : "Verify Email",
            to : req.body.email,
            html : "Hello,<br><p>Please click on the link to verify your email.<br><a href="+link+">click here to verify</a>"
           }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, info){
                if(error){
                console.log(error);
                res.end("error Occured man Check some Errors and fixed them");
                }else{

                console.log("Message sent: " + info.response);
                res.end("sent");
                }
        });
    });

router.get('/verify', function(req,res){
     var email = req.query.email;
     var verify = 1;
    
    var emailmatch="select * from userlogin where email='"+email+"'";
    con.query(emailmatch,function(err,result){
        if(err) throw err;
        if(result.length==0){
            res.end('you are not verified');
        }
        else{
            console.log(result);
            var sql21="update userlogin set verified='"+verify+"' where email='"+email+"'";
            con.query(sql21,function(err,resultt){
                if(err) throw err;
                console.log(resultt);
                res.redirect('login');
            })
        }
    });
});

router.get('/editform', function(req, res, next) {
    var id= req.query.id;
    
        var sql3 = "select * from usertbl where id="+id;
        con.query(sql3,function(err,result){
            if(err) throw err;
            console.log(result);
            res.render('editform', {user : result[0]});
            
      });
  
});

router.post('/updateUser', urlencodedParser, function(req, res, next) {
   
  console.log("##########################################################33");
    var upload = multer({storage:storage}).single("myfile");
  
     upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }
//         console.log(req);
         console.log("==================");
         
    var id= req.body.id;
    console.log(id);
    var name=req.body.name;
    var address=req.body.address;
    console.log(req.body.myfile);
          
            var sql6="UPDATE usertbl SET name='"+name+"', address='"+address+"' where id='"+id+"'";
         
         if(req.file){
             var photo=req.file.filename;
              console.log(photo);
             sql6="UPDATE usertbl SET name='"+name+"', address='"+address+"', Photo='"+photo+"' where id='"+id+"'";
          
         }
          con.query(sql6,function(err,result){
            if(err) throw err;          
          res.redirect('getUserlist');
        });
     });
});



/* GET Userlist of database code to print on the browser. */
router.get('/getuserlist',urlencodedParser, function(req, res, next) {
    
        
        var sql2 = "select * from usertbl";
        con.query(sql2,function(err,result){
            if(err) throw err;
            console.log(result);
            res.locals.username=req.session.username;
            res.locals.password=req.session.password;

            res.render('Login_form',{userlist: result});
        });
    });
    

/* GET Add the user list to the database. */
router.post('/adduser', urlencodedParser, function(req, res, next) {
    
   
    var upload = multer({storage:storage}).single("myfile");
     upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
//        res.end("File is uploaded successfully!");
//            var id= req.body.id;
            var name= req.body.name;
            var address=req.body.address;
                
                var sql1 = "INSERT into usertbl(name,address,photo) VALUES('"+name+"','"+address+"','"+photo+"')";
            if(req.file){
                var photo=req.file.filename;
                 var sql1 = "INSERT into usertbl(name,address,photo) VALUES('"+name+"','"+address+"','"+photo+"')";
            }
        
        con.query(sql1,function(err,result) {
            if(err) throw err;
            console.log(result);

            res.redirect("getUserlist");
            });
        });
    });
    
/* delete a user from the database from its ID. */
router.get('/deleteUser', function(req, res, next) {
    
    var id= req.query.id;
    
        var sql3 = "delete from usertbl where id=("+id+")";
        con.query(sql3,function(err,result){
            if(err) throw err;
            console.log(result);

            res.redirect("getUserlist");
            
      });
    });

    module.exports = router ;
