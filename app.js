const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const flash = require('connect-flash');
const port = 5000;


//load routes



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
app.get('/executive', (req, res) => {
    res.render('executive/index');
})
app.get('/customer/add', (req, res) => {
    res.render('customer/add');
});
app.post('/customer/add', (req, res) => {
    con.connect(function (err) {
        //const sql='insert into customers values('req.body.cname', req.body.address,req.body.ssn,req.body.age);'
        var sql = 'insert into customers (customer_Name,customer_address,ssn,age) values(?,?,?,?);'
        var valuearr = [req.body.cname, req.body.address, req.body.ssn, req.body.age]
        con.query(sql, valuearr, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            res.render('customer/list');
        });
    });
});

app.get('/customer/list', (req, res) => {
    con.connect(function (err) {
        var sql = 'select * from customers';
        con.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            res.render('customer/list', {
                result: result
            })
        })

    })
})

app.get('/customer/search', (req, res) => {
            res.render('customer/customersearch');
})
app.post('/customer/search', (req,res)=>{
    con.connect(function (err) {
        var sql = 'select * from customers where customer_ID=?';
        var valuearr = [req.body.customerid]
        
        con.query(sql,valuearr, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            res.render('customer/update', {
                result: result
            })
        })

    })
})


app.post('/customer/update/:id', (req, res) => {
    con.connect(function (err) {
        //const sql='insert into customers values('req.body.cname', req.body.address,req.body.ssn,req.body.age);'
        var sql = 'update customers SET customer_Name=? ,customer_address=? ,age=? where customer_ID=?;';
        var valuearr = [req.body.cname, req.body.address, req.body.age,req.params.id];
        con.query(sql, valuearr, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            res.render('customer/customersearch');
        });
    });
});
app.listen(port,()=>{
    console.log('server started on port 5000');
});