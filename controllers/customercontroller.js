
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

module.exports = {

    checkID(idorssn){
            con.connect(function (err) {
                var sql = 'select customer_ID from customers';
                con.query(sql,(err,result)=>{
                    if(err)
                    throw err;
                    var stringx = JSON.stringify(result);
                    var json = JSON.parse(stringx);

                    for(var i=0;i<json.length;i++){
                        if(json[0].custoemr_ID==idorssn){
                            //i know i am trying to return an async call thats why this returns undefined in my executive.js
                            //but how do i return this value 
                            return true;
                        }else{
                            return false;
                        }
                    }
                })
            });
    }
}

