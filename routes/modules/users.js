const express = require('express')
const router = express.Router()
const passport = require('passport') // 把 Passport 套件本身載入進來 ->因為登入驗證要用Passport的authenticate套件，因此還是要載入這個
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
      })
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router
