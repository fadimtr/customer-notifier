const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const mysql = require('./db');

passport.use(new LocalStrategy(function (username, password, cb) {
    console.log('passport');
        mysql.db.query( mysql.db.format("SELECT * FROM users WHERE email = ? AND password = ?",[username,password]), function(err,users){
            console.log('user name' + err);
            if(!users || users.length == 0 || users.isActive == false){
                return cb(null,false,{message: err || 'user is inactive'});
            }
            return cb(null, users[0], {message: 'Logged In Successfully'});
        });
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload, cb) {
    return cb(null, 'fadi');

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return UserModel.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));
