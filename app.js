const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport') // 把 Passport 套件本身載入進來 ->因為登入驗證要用Passport的authenticate套件，因此還是要載入這個
const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後
const routes = require('./routes')

const app = express()
const PORT = 3000
const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)


app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then((todo) => res.render('detail', { todo: todo.toJSON() }))
    .catch((error) => console.log(error))
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
