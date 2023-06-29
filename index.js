var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

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
  type Query {
    hello: String,
    getName: String,
    getAge: Int,
    getAllNames:[String],
    getAllAges:[Int],
    getAccountInfo: Account,
    getNowPlayingList:[Film] 
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
  hello: () => {
    return 'Hello, world!!!';
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
