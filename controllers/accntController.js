
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

    deactivateAcc(accid){
        con.connect(function (err) {
            var sql = "update account_status SET a_status= ?, a_message=?, lastupdated=? where account_ID=?;";
            var timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var valuearr = ['Inactive','Account Deactivated',timestamp, accid];
            con.query(sql,valuearr,(err,result)=>{
                if (err)
                throw err;
                return result;
            });
        });
    }
}

