var express =   require("express");  
var multer  =   require('multer');  
var router =   express.Router();  

var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/images');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
});  
var upload = multer({ storage : storage}).single('myfile');  
  
router.get('/',function(req,res){  
      res.render("fileUploader");  
});  
  
router.post('/uploadjavatpoint',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        res.end("File is uploaded successfully!");  
    });  
});  
  
module.exports = router;