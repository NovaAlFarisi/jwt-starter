var express = require('express');
var router = express.Router();

router.get('/', (req,res)=>{
    var uData = req.cookies.userData;
    res.render('home', uData);
});

module.exports = router;