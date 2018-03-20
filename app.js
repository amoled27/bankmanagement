const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
// const flash = require('connect-flash');
const port = 5000;


//load routes
const executive=require('./routes/executive');


//middleware for handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware for coonect-flash
// app.use(flash());
//  -----global variables

// app.use(function (req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// })


//public directory path
app.use(express.static(path.join(__dirname, 'public')));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "amod123",
    databasename: "bankdb"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
con.changeUser({
    database: "bankdb"
}, function (err) {
    if (err) {
        console.log('error in changing database', err);
        return;
    }
});
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/about',(req,res)=>{
    res.render('about');
})
app.use('/executive',executive);
app.listen(port,()=>{
    console.log('server started on port 5000');
});