'use strict';

const express=require('express');
const pg=require('pg');
const superagent=require('superagent');
const cors=require('cors');
const methodOverride=require('method-override');

const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
let PORT = process.env.PORT || 3000;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
});

app.get('/',homePage)
app.post('/addFav',addToFav)
app.get('/favorite',favoriteRender)
app.get('/favorite/:id',details)
app.put('/update/:id',updateQ)
app.delete('/delete/:id',deleteQ)

function updateQ(req,res) {
  let SQL = `UPDATE quotes SET character=$1,quote=$2 WHERE id=$3 ;`
  let safeValues = [req.body.character,req.body.quote,req.params.id];
  client.query(SQL,safeValues)
    .then(()=>{
      res.redirect('back');
    })
}
function deleteQ(req,res) {
  let SQL = `DELETE FROM quotes WHERE id=$1 ;`
  let safeValues = [req.params.id];
  client.query(SQL,safeValues)
    .then(()=>{
      res.redirect('/favorite');
    })
}

function details(req,res) {
  let SQL = `SELECT * FROM quotes WHERE id=${req.params.id};`;
  client.query(SQL)
    .then(data=>{
      res.render('details',{data:data.rows[0]});
    })
}
function favoriteRender(req,res) {
  let SQL = 'SELECT * FROM quotes ;';
  client.query(SQL)
    .then(data=>{
      res.render('favorite',{data:data.rows})
    })
}

function addToFav(req,res) {
  let data = req.body;
  let SQL = 'INSERT INTO quotes  (character,image,quote,direction) VALUES ($1,$2,$3,$4);'
  let safeValues =[data.character,data.image,data.quote,data.characterDirection];
  client.query(SQL,safeValues)
    .then(()=>{
      res.redirect('/favorite')
    })
}


function homePage(req,res) {
  superagent.get('https://thesimpsonsquoteapi.glitch.me/quotes?count=10').set('User-Agent', '1.0')
    .then(data=>{
      res.render('home',{data:data.body})
    })
}




client.connect()
  .then(()=>{app.listen(PORT,()=>{console.log(PORT)})})
