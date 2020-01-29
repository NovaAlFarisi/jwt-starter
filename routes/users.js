var express = require('express');
var router = express.Router();
const {users} = require('../models/')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res)=>{
  var registData = req.body;
  users.create({
    email: registData.email,
    password: bcryptjs.hashSync(registData.password)
  }).then(data=>{
    return res.json({
      status:200,
      message:'user created',
      data: data
    })
  }).catch(err=>{
    return res.json({
      status:400,
      message:'error while inserting your data',
      err: err
    });
  });
});

router.post('/login', function(req, res, next) {
  var loginData = req.body;
  users.findOne({
    where: {
      email: loginData.email
    },
    raw: true
  }).then(uData=>{
    if(bcryptjs.compareSync(loginData.password, uData.password)){
      var payload = {
        email: uData.email
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRES
      });
      res.cookie('token', token, {maxAge:24 * 60 * 60 * 1000 , httpOnly:true});
      return res.redirect('/home');
    } else {
      return res.redirect('/?error=no data');
    }
  }).catch(err=>{
    res.send(err);
  });
});

router.get('/logout', (req,res)=>{
  if(res.clearCookie('token')){
    res.redirect('/');
  }
});
module.exports = router;
