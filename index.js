var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type Account{
  name: String,
  age:Int,
  location: String,
}
type Film{
  id:Int,
  name:String,
  poster:String,
  price:Int
}
input FilmInput{
  name:String,
  poster:String,
  price:Int
}
  type Query {
    hello: String,
    getName: String,
    getAge: Int,
    getAllNames:[String],
    getAllAges:[Int],
    getAccountInfo: Account,
    getNowPlayingList:[Film],
    getFilmDetails(id:Int!):Film,
  }
  type Mutation {
      createFilm(input: FilmInput):Film,
      updateFilm(id:Int!,input:FilmInput):Film,
      deleteFilm(id:Int!):Int
  }
`);
let fakeDB = [
  {
    id: 1,
    name: 'j',
    poster: 'http://111',
    price: 199,
  },
  {
    id: 2,
    name: 'j',
    poster: 'http://111',
    price: 299,
  },
  {
    id: 3,
    name: 'j',
    poster: 'http://111',
    price: 99,
  },
];
// The root provides a resolver function for each API endpoint
var root = {
  createFilm({ input }) {
    let obj = { ...input, id: fakeDB.length + 1 };
    fakeDB.push(obj);
    return obj;
  },
  updateFilm({ id, input }) {
    // console.log(id, input);
    let current = null;
    fakeDB = fakeDB.map((item) => {
      if (item.id === id) {
        current = { ...item, ...input };
        return { ...item, ...input };
      }
      return item;
    });
    return current;
  },
  deleteFilm({ id }) {
    fakeDB.filter((item) => item.id !== id);
    return 1; //success
  },
  getName: () => 'getName: Jim',
  getAge() {
    return 18;
  },
  getAllNames: () => ['JJ', 'MM', 'CC'],
  getAllAges: () => [18, 19, 99],
  getAccountInfo: () => {
    return { name: 'Jim', age: 18, location: 'Dallas, TX' };
  },
  getNowPlayingList() {
    return fakeDB;
  },
  getFilmDetails({ id }) {
    return fakeDB.filter((item) => item.id === id)[0]; //return Film, not []
  },
};

var app = express();
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/');

/*

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://j:w@clusterj.sobzoi2.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

*/
