const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ where: { email } }) // 查詢特定email的User
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered!' })
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(null, false, { message: 'Email or Password incorrect.' })
            }
            return done(null, user)
          })
        })
        .catch((err) => done(err, false))
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id) // 查詢特定id的User
      .then((user) => {
        // 把User 物件轉成 plain object 回傳給 req 繼續使用
        user = user.toJSON()
        done(null, user)
      })
      .catch((err) => done(err, null))
  })
}
