const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const app = express();
const cors = require('cors');

require('dotenv').config();

// mongoDBの接続
mongoose.connect(process.env.DB_PATH);
mongoose.connection.once('open', () => {
  console.log('mongoDB 接続完了');
})

// 異なるドメイン下での許可
app.use(cors());

app.use('/graphql', graphqlHTTP({
  // スキーマの定義
  schema,
  // スキーマ（DB）のテスト
  graphiql: true,

}));

app.listen(4000, () => {
  console.log('listening post 4000');
});