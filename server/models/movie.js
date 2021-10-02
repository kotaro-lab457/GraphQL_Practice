const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// スキーマ作成
const movieSchema = new Schema({
  name: String,
  genre: String,
  directorId: String,
});

module.exports = mongoose.model('Movie',movieSchema);
// 第一に名前、第二引数にスキーマ指定