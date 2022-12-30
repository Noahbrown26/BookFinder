const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const { authMiddleware } = require('./utils/auth');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers, 
  context: authMiddleware, 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, '../client/build')));


app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`); 
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);})
});