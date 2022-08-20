var express = require('express');
var app = express();


//let comments = [];

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

//() = {} //() 입력 안에 , 함수고 { } 은 안에 리턴 되는 부분  
(async () => { // 익명함수 
//await Comments.sync({ force: true }); //force: true 초기화 하는 옵션
await Comments.sync(); // sync 는 오래걸리니까  await 를 쓰고 awit 를 쓰려면 반드시 async 함수 안에 있어야 되서 위에 익명함수 정의,() 이 안에뭔가 들어있어서 디비가 날아가게 되어있었으나 비워서 지워지지 않게 함
//console.log("The table for the User model was just (re)created!");
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// `sequelize.define` also returns the model
//console.log(Comments === sequelize.models.Comments); // true

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  //res.render('index', {num: 3});
  const comments = await Comments.findAll();  //Comments 변수의 모든것을 가져와라
  
  //console.log(comments)

  //res.render('index', {comments: comments});
  res.render('index', {comments: comments});
});

app.post('/create', async function(req, res) {
    console.log(req.body)
    //res.send('hi')

    const { content }  = req.body

    //comments.push(content)
    // Create a new user , ORM 방식, 조코딩 5강 ppt 참조
    //const jane = await Comments.create({ content: content });
    await Comments.create({ content: content });
    //console.log("Jane's auto-generated ID:", jane.id);

    //console.log(comments);
    res.redirect('/')

});

app.post('/update/:id', async function(req, res) {
    console.log(req.params)
    console.log(req.body)

    const { content }  = req.body
    const { id } = req.params

    //await Comments.create({ content: content });

    // Change everyone without a last name to "Doe"
    await Comments.update({ content: content }, {
        where: {
        id: id
        }
    });

    res.redirect('/')

});

app.post('/delete/:id', async function(req, res) {
    console.log(req.params)
    const { id } = req.params

    //await Comments.create({ content: content });

    // Change everyone without a last name to "Doe"
    await Comments.destroy({
        where: {
        id: id
        }
    });

    res.redirect('/')

});

app.listen(3000);
console.log('Server is listening on port 3000');