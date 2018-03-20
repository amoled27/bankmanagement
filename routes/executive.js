const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const moment = require('moment');


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
router.get('', (req, res) => {
    res.render('executive/index');
})
router.get('/customer/add', (req, res) => {
    res.render('customer/add');
});
router.post('/customer/add', (req, res) => {
    con.connect(function (err) {
        //const sql='insert into customers values('req.body.cname', req.body.address,req.body.ssn,req.body.age);'
        var sql = 'insert into customers (customer_Name,customer_address,ssn,age) values(?,?,?,?);'
        var valuearr = [req.body.cname, req.body.address, req.body.ssn, req.body.age]
        con.query(sql, valuearr, function (err, result) {
            if (err) throw err;
            console.log(result);
            var sql = 'select customer_ID from customers where ssn=?';
            var valuearr =[req.body.ssn];
            con.query(sql,valuearr,(err,result)=>{
                if(err) throw err;
                var stringx = JSON.stringify(result);
                var json = JSON.parse(stringx);
                console.log(json[0].customer_ID);
                var sql = 'insert into customer_status (customer_ID,SSNID,c_status,c_message) values(?,?,?,?);';
                var valuearr = [json[0].customer_ID,req.body.ssn, 'Active', 'Customer added',];
                con.query(sql, valuearr, (err, result) => {
                    if (err) throw err;
                    console.log("Result: " + result);
                    res.redirect('/executive/customer/list');
                });
            });
        });
    });
});

router.get('/customer/list', (req, res) => {
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

router.get('/customer/search', (req, res) => {
    res.render('customer/customersearch');
})

router.post('/customer/search', (req,res)=>{
    con.connect(function (err) {
    var sql = 'select * from customers where customer_ID=?';
    var valuearr = [req.body.customerid]

    con.query(sql, valuearr, (err, result) => {
        if (err)
            throw err;
            console.log(result)
       res.render('customer/customersearch',{
           result:result
       });
    })

})
})
router.get('/customer/update/:id', (req, res) => {
    con.connect(function (err) {
        var sql = 'select * from customers where customer_ID=?';
        var valuearr = [req.params.id]

        con.query(sql, valuearr, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            res.render('customer/update', {
                result: result
            })
        })

    })
})


router.post('/customer/update/:id', (req, res) => {
    con.connect(function (err) {
        var sql = 'update customers SET customer_Name=? ,customer_address=? ,age=? where customer_ID=?;';
        var valuearr = [req.body.cname, req.body.address, req.body.age, req.params.id];
        con.query(sql, valuearr, function (err, result) {
            if (err) throw err;
          
            var sql = 'update customer_status SET c_message=? , lastupdated=? where customer_ID=?;';
            var valuearr = ['Customer updated', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), req.params.id];

            con.query(sql, valuearr, (err, result) => {
                if (err) throw err;
                console.log("Result: " + result);
                res.redirect('/executive/customer/list');
            })
           
        });
    });
});

// router.post('/customer/deactivate/:id')




module.exports = router;