const jwt = require('jsonwebtoken');

exports.requiredToken = (req, res, next) => {
    var token = req.cookies.token;
    if(jwt.verify(token, process.env.JWT_SECRET_KEY,(err, decoded) =>{
        if(!err){
            res.cookie('userData', decoded, {maxAge:24 * 60 * 60 * 1000 , httpOnly:true});
            next();
        } else {
            return res.redirect('/');
        }
    }));
}