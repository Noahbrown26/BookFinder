const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// setup new instance of apollo server //
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// setup middleware with apollo server //
server.applyMiddleware({ app });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// pass in cors for apollo //
app.use(cors()); 

app.use(express.static(path.join(__dirname, '../client/build')));

// get front-end production build folder //
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// initialize server //
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
