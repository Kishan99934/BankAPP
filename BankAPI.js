/**
 * Created by Kishan on 2/23/2016.
 */
var express = require('express');
var router = express.Router();

var app = express();

//db connection
var mongo = require("mongodb");
var dbhost = "127.0.0.1",
    dbport = 27017;

var db=new mongo.Db("Bank-Collection", new mongo.Server(dbhost,dbport, {}));

//Register User
app.post('/Register',function(req,res){
    db.open(function (error) {
        if (error){
            console.log("Can Not Connect" +error);
        }
        else{
            db.collection("customers", function (error, collection) {
                if (error){
                    console.log("Unable to insert to DB" +error);
                }
                else if (collection){
                    var num = Math.floor(Math.random()*1000);
                    var user= req.query.customername;

                    collection.insert({
                        CustomerName: user,
                        SSN: req.query.ssn,
                        EmailId: req.query.emailid,
                        Address: req.query.address,
                        Password: req.query.password,
                        AccountNo: num.toString()
                    });

                    collection.find({'CustomerName': user}).nextObject(function(error, result) {
                        if(error){
                            console.log("Unable to find DB query" +error);
                        }
                        else if (result){
                            res.json(result);
                        }
                        else{
                            res.send("Failure");
                        }
                    });
                }
                else {
                    res.send("Failure");
                }

            });
        }
    });
});



//customer Login
app.post('/Login',function(req,res){
    var userid= req.query.userid;
    var pwd =req.query.pwd;
    db.open(function (error) {
        if (error){
            console.log("Unable to connect to DB" +error);
        }
        else{
            db.collection('customers',function (error, collection) {

                    collection.find({'EmailId':userid,'Password':pwd}).next(function(error, result) {
                    if(error){
                        console.log("Unable to find DB query" +error);
                    }
                    else if (result){
                        res.send("Login Successful \r\n CustomerName: " +result.CustomerName + "\r\n AccountNo: " +result.AccountNo);
                    }
                    else{
                        //console.log(ress);
                        //console.log(pwd);
                        res.send("Invalid Credential");
                    }
                });


            });
        }
    });
});



//Insert Deposit
app.post('/Deposit',function(req,res){
    var userid= req.query.userid;
    var pwd =req.query.pwd;
    var DepositAmount = req.query.amount;
    db.open(function (error) {
        if (error){
            console.log("Error" +error);
        }
        else{
            db.collection('customers',function (error, collection) {
                collection.update({'EmailId':userid,'Password':pwd},{$set:{"Amount":DepositAmount}},function(error, result) {
                    if(error){
                        console.log("Error" +error);
                    }
                    else if (result) {
                        res.send("Successfully Deposite Amount" +result.Amount);
                    }
                    else{
                        res.send("Amount Not Deposite ! Error");
                    }
                });
            });
        }
    });
});

app.get('/CheckBalance', function(req, res,next) {
    var account = req.query.account;
    console.log(account);
    db.open(function (error) {
        if (error){
            console.log("Can not open the database ! Error" +error);
        }
        else{
            db.collection('customers',function (error, collection) {
                collection.find({'AccountNo': account}).next(function(error, result) {
                    if(error){
                        console.log("Error Accessing the account" +error);
                    }
                    else if(result){
                        res.send( "Customer Name"+ result.CustomerName +  "\r\n Account No :" +result.AccountNo+ "\r\n Accont Balance: " +result.Amount);
                    }
                    else{
                        res.send("Can not Access youe account ! Error");
                    }
                });
            });
        }
    });
});


/*/!* GET users listing. *!/
router.get('/', function(req, res, next) {
    res.send('Banking Application');
});*/

//router.listen()

app.listen(3006,function(){
    console.log('Listening on the port :3006');
});

module.exports = router;
