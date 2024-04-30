/** @format */

const express = require('express');
const app = express();
const port = 3000;

const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://sungu:QTMY1zzIXzrHDNZ4@cluster0.zbjmaiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index');
});

const getDB = async () => {
  await client.connect();
  return client.db('todo');
};

app.get('/list', async (req, res) => {
  try {
    const db = await getDB();
    const posts = await db.collection('posts').find().sort({ _id: -1 }).toArray();
    // console.log(posts);
    res.render('list', { posts }); // {posts: posts}
  } catch (error) {
    console.error(error);
  }
});

app.post('/add', async (req, res) => {
  console.log(req.body);
  const { title, dateOfGoals, today } = req.body;
  try {
    const db = await getDB();
    const result = await db.collection('counter').findOne({ name: 'counter' });
    console.log(result.totalPost);
    await db.collection('posts').insertOne({ _id: result.totalPost + 1, title, dateOfGoals, today });
    await db.collection('counter').updateOne({ name: 'counter' }, { $inc: { totalPost: 1 } });
  } catch (error) {
    console.error(error);
  }
  res.redirect('/list');
});

app.get('/detail/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  try {
    const db = await getDB();
    const post = await db.collection('posts').findOne({ _id: id });
    res.render('detail', { post });
    console.log(post);
  } catch (error) {
    console.error(error);
  }
});

app.post('/delete', async (req, res) => {
  const id = parseInt(req.body.postNum);
  console.log(id);
  try {
    const db = await getDB();
    await db.collection('posts').deleteOne({ _id: id });
    res.redirect('/list');
  } catch (error) {
    console.log(error);
  }
});

app.get('/edit/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(req.params.id);
  try {
    const db = await getDB();
    const post = await db.collection('posts').findOne({ _id: id });
    res.render('edit', { post });
  } catch (error) {
    console.log(error);
  }
});

app.post('/update', async (req, res) => {
  //   console.log(req.body);
  //   console.log(id);
  const { id, title, dateOfGoals, today } = req.body;
  try {
    const db = await getDB();
    const post = await db.collection('posts').updateOne({ _id: parseInt(id) }, { $set: { title, dateOfGoals, today } });
    res.redirect('/list');
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`서버실행중... ${port}`);
});
