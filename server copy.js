/** @format */

const express = require('express');
const app = express();
const port = 8080;

const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://sungu:yzRznutKPTgm1L8E@cluster0.8w5vbej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb sungu / yzRznutKPTgm1L8E
// mongodb+srv://sungu:yzRznutKPTgm1L8E@cluster0.8w5vbej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// npm i mongodb

// const connetDB = async () => {
//   try {
//     await client.connect();
//     console.log('DB연결');
//     const db = client.db('todo');
//     await db.collection('posts').insertOne({ name: '홍길동', date: '2024-04-29' });
//     console.log('DB 추가 확인');
//   } catch (error) {
//     console.error(error);
//   }
// };

// connetDB();

app.get('/', (req, res) => {
  //   res.send('서버개발시작');
  //   res.sendFile(__dirname + '/index.html');
  res.render('index');
});

app.get('/test', (req, res) => {
  res.send('테스트 페이지입니다.');
});

app.get('/list', async (req, res) => {
  //   res.sendFile(__dirname + '/list.html');
  try {
    await client.connect();
    const db = client.db('todo');
    const posts = await db.collection('posts').find().toArray();
    console.log(posts);
    res.render('list', { posts }); // {posts : posts}
  } catch (error) {
    console.error(error);
  }
});

app.get('/detail', (req, res) => {
  //   res.sendFile(__dirname + '/detail.html');
  res.render('detail');
});

app.post('/add', async (req, res) => {
  //   console.log('req----', req.body);
  //   const title = req.body.title;
  //   const dateOfGoals = req.body.dateOfGoals;
  const { title, dateOfGoals } = req.body;
  //   console.log(title);
  //   console.log(dateOfGoals);
  // 받아온 정보를 mongodb 에 저장
  try {
    await client.connect();
    // console.log('DB연결');
    const db = client.db('todo');
    await db.collection('posts').insertOne({ title, dateOfGoals });
    // console.log('DB 추가 확인');
  } catch (error) {
    console.error(error);
  }
  //   res.send('post 요청확인');
  res.redirect('/list');
});

app.listen(port, () => {
  console.log(`서버실행중... ${port}`);
});
