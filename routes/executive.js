const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const moment = require('moment');

const accntController = require('../controllers/accntController');
const custController = require('../controllers/customercontroller');

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
router.get('/account/add',(req,res)=>{
    res.render('account/add');
});


router.post('/account/add',(req,res)=>{
    con.connect(function (err) {
        var at= null;
        var actype= req.body.acctype;
        console.log('actype'+req.body.acctype);
        actype = actype.toLowerCase();


        if(actype=='savings'){
             at='S';
            console.log('account type is savings'+ at);
        } else if (actype== 'current'){

             at = 'C';
            console.log('account type is savings' + at);
            
        }

        var sql = 'select acctype from accounts where customer_ID =?';
        var valuearr = [req.body.cid];
        con.query(sql,valuearr,(err,result)=>{
            if(err)
            throw err;

            var stringac = JSON.stringify(result);
            var jsac = JSON.parse(stringac);
            console.log(jsac.length);
            var jsac_acctype= null;
           if(jsac.length>0){
               console.log('bing');
               console.log(jsac[0].acctype);
               jsac_acctype = jsac[0].acctype;

           }
            if (jsac_acctype == at) {
                   console.log(req.body.acctype + " account alredy exists");
                   res.redirect('/executive/account/add');
                   
               
           }else{
               console.log('ching');
               var sql = 'insert into accounts (customer_ID, acctype, balance) values(?,?,?)';
               var valuearr = [req.body.cid, at, req.body.balance];
               con.query(sql, valuearr, (err, result) => {
                   if (err)
                       throw err;
                    var sql = 'select LAST_INSERT_ID() as account_ID;'
                    con.query(sql,(err,result)=>{
                       var stringx = JSON.stringify(result);
                       var json = JSON.parse(stringx);
                       console.log(json);
                        var account_ID= json[0].account_ID;
                       var sql = 'insert into account_status (account_ID, customer_ID, acctype, a_status,a_message) values(?,?,?,?,?);';
                       var valuearr = [account_ID, req.body.cid, at, 'Active', 'Account created'];
                       con.query(sql,valuearr,(err,result)=>{
                           if(err)
                           throw err;
                           console.log(result);
                           res.redirect('/executive');
                       });
                    });
                   
               });
           }
         
      
        });

      
        
        });
});


router.get('/account/list', (req, res) => {
    con.connect(function (err) {
        var sql = 'select customers.customer_Name, accounts.account_ID, accounts.acctype, accounts.balance from accounts inner join customers on customers.customer_id=accounts.customer_id';
        con.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            var stringx = JSON.stringify(result);
            var json = JSON.parse(stringx);
            for(var i=0;i<json.length;i++){
                if(json[i].acctype=="S"){
                    json[i].acctype="Savings";
                } else if(json[i].acctype == "C"){
                    json[i].acctype = "Current";
                }
            }
            console.log(json);
            console.log(accntController.deactivateAcc(2));
            res.render('account/list', {
                result: json
            })
        })

    })
})


router.get('/account/search',(req,res)=>{
    // accntController.deactivateAcc()
   res.render('account/accountsearch');
});



// =========================== difficulty
router.post('/account/search', (req, res) => {
   var idorssn = req.body.idorssn;
    custController.checkID(idorssn, function (err, flag) {
        if (err) {
            return res.status(500).send({
                error: 'Internal server error'
            })
        }

    if(flag){
        res.redirect('/executive');
    }else{
        res.redirect('/executive/account/search');
    }
    })
    
});



module.exports = router;