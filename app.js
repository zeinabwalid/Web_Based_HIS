//const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//const jwt = require("jsonwebtoken")
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
const multer = require ('multer');

// const engines = require('consolidate');
const nurses = require("./routes/nurses");
const equipments = require("./routes/equipments");
const exphbs = require('express-handlebars');
const mangers = require("./routes/mangers");
const engs = require("./routes/engs");
const doctors = require("./routes/doctors");
const patients = require("./routes/patients");
const medicines = require("./routes/medicines");
const rooms = require("./routes/rooms");
const feedbacks = require("./routes/feedbacks");
const login = require("./routes/login");
const app = express();
app.engine('.hbs',exphbs({layout:false,extname:'.hbs'}));
app.engine('.html',exphbs({layout:false,extname:'.html'}));
app.set('views','views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('views'));
app.set('view engine', '.hbs');
app.engine('html', require('hbs').__express);
app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}));
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
//upload:
const filestorage = multer.diskStorage({
    destination:(req,file, cb)=>{
      cb(null,'images');
    },
    filename:(req,file,cb)=> {
      cb(null, '-' + file.originalname);
      //new Date().toISOString()
    }
  })
  const filefilter = (req,file,cb)=> {
    if(file.mimetype=== 'image/png'|| file.mimetype=== 'image/jpg' || file.mimetype=== 'image/jpeg')
    { 
      cb(null,true);
    }else{
      console.log("Wrong image type");
      cb(null,false);
    }
  }
  app.use(multer({dest: 'images', storage: filestorage,fileFilter:filefilter}).single('image'));
  

//  if (!config.get('jwtprivatekey')){
//    console.error('fatal error: jwtprivatekey is not defined ');
//    process.exit(1);
// }
// in terminal set doctor_jwtprivatekey = my securekey
// a run b3d kda


// Database connection
mongoose
  .connect("mongodb://localhost/icu")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error(err));

// Route Files
app.use(express.json());
app.use("/api/mangers", mangers);
app.use("/api/engs", engs);
app.use("/api/nurses", nurses);
app.use("/api/equipments", equipments);
app.use("/api/rooms", rooms);
app.use("/api/patients", patients);
app.use("/api/doctors", doctors);
app.use("/api/medicines", medicines);
app.use("/api/feedbacks", feedbacks);
 app.use("/api/login", login);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
