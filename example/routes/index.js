var express = require('express');
var multer = require('multer');
var path=require('path');

var router = express.Router();

//set storage
const storage=multer.diskStorage({
  destination:'./public/example/',
  filename:function(req,file,cb){
      cb(null,file.originalname+'-'+Date.now()+path.extname(file.originalname));
  }
});

//init upload
const upload=multer({
  storage:storage,
  fileFilter:function(req,file,cb){
    checkFileType(file,cb);
  }
}).single('myImage');
//check file type
function checkFileType(file,cb){
  const filetype = /jpeg|jpg|png|gif/;
  const extname =filetype.test(path.extname(file.originalname).toLowerCase());
  const mimetype =filetype.test(file.mimetype);
  if(mimetype && extname){
    return cb(null,true);
  }else{
    cb('Error:Images only!');
  }
}

//upload
router.post('/upload', function(req, res){
  upload(req,res,(err) =>{
    if(err){
      res.render('index',{msg:err});
    }else{
      if(req.file == undefined){
        res.render('index',{msg:'Error: No File Selected!'});
      }else{
        res.render('index',{
          msg:'File Uploaded!',
          file:`/example/${req.file.filename}`
        })
      }
    }
  });

})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
