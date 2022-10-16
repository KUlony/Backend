const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const UserModel = require("../schemas/modeluser");
const passport = require('passport')
var dotenv = require("dotenv");
dotenv.config();

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
// opts.secretOrKey ="Random";

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
   
    UserModel.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user ) {
            if (user.status_login)
              return done(null, user);
            else {
              return done("login againt", false);
            }
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));