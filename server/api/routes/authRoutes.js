const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");

/* POST login. */
router.post('/login', function (req, res, next) {

    console.log('login');
    
    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log('login auth ' + err + ' ' + user);
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
        console.log('login second auth ' + err + ' ' + user);
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const jwtUser = {
             id : user.id,
             name: user.name,
             email : user.email,
             isAdmin : user.isAdmin
           };
           const token = jwt.sign(jwtUser, 'your_jwt_secret', {
            expiresIn: 60*60*24 // expires in 24 hours
            });
           return res.json({user: jwtUser, token});
        });
    })(req, res);
});

router.get('/logout', function(req, res){
    req.logOut();
    res.send('logged out!');
  });

module.exports = router;