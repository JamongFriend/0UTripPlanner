const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ 
        where: { id },
        attributes: ['id', 'name', 'email']
      });
      
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      console.error("deserializeUser 에러:", err);
      done(err);
    }
  });

  local();
  kakao();
};
