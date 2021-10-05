// データ同士のリレーションを定義
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const Movie = require('../models/movie');
const Director = require('../models/director');


//インスタンスの生成（フィールドの型定義関数）
const MovieType = new GraphQLObjectType({
  name: 'Movie',

  // 取得したいデータ（fields）：型定義
  // 順番に気をつける
  fields: () => ({
    id :{type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // 親のモデルで定義したIdを参照する（parent）
        return Director.findById(parent.directorId);
      },
    },
  }),
});

// 映画監督の作成
const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id :{type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({ directorId: parent.id }); // find??
      }
    },
  }),
});

// 🟥外部からデータ（Movie, Director）を取得する🟥
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: MovieType,
      args: {id: {type: GraphQLID}}, //API検索時に渡すパラメータ
      // argsのパラメータを利用してDBからデータ取得
      resolve(parents, args) {
        return Movie.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve(parents, args) {
        return Director.findById(args.id);
      },
    },
    // 複数の映画データ取得
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parents, args) {
        return Movie.find({})
      }
    },
    // 複数の監督データ取得
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parents, args) {
        return Director.find({})
      }
    }
  },
});

// GraphQLのデータ作成
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // 追加
    addMovie: {
      type: MovieType,
      args: {
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        directorId: {type: GraphQLID},
      },
      resolve(parent, args){
        let movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        // saveメソッドでmongoDBにセーブする。
        return movie.save();
      },
    },
    // 追加
    addDirector: {
      type: DirectorType,
      args: {
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
      },
      resolve(parent, args) {
        let director = new Director({
          name: args.name,
          age: args.age,
        });

        return director.save();
      }
    },
    // 更新
    updateMovie: {
      type: MovieType,
      args: {
        // IDの必須（non null）
        id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        directorId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        let updateMovie = {};
        
        // オブジェクト構造の代入方法??
        args.name && (updateMovie.name = args.name);
        args.age && (updateMovie.genre = args.genre);
        args.directorId && (updateMovie.directorId = args.directorId);
        return Movie.findByIdAndUpdate(args.id, updateMovie, {new: true}); // new: trueで変更後の値を取得可能にする
      }
    },
    //　更新
    updateDirector: {
      type: DirectorType,
      args: {
        // IDの必須（non null）
        id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parent, args) {
        let updateDirector = {};

        // オブジェクト構造の代入方法??
        args.name && (updateDirector.name = args.name);
        args.age && (updateDirector.age = args.age);
        return Director.findByIdAndUpdate(args.id, updateDirector, {new: true}); // new: trueで変更後の値を取得可能にする
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        return Movie.findByIdAndRemove(args.id);
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        return Director.findByIdAndRemove(args.id);
      },
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})