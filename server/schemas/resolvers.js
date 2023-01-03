const { User, Book } = require('../models');
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    // query to find user //
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            return userData;
        }
        throw new AuthenticationError('Please login and try again');
    }
},
  Mutation: {
    // mutation to add a user with jswt //
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
  },
    // mutation to login user given an email and password //
    login: async (parent, { email, password }) => {
      const user = await User.findOne( { email });
      if (!user) {
          throw new AuthenticationError('Username or Password incorrect')
      }
      const correctPw = await user.isCorrectPassword(password);
      if(!correctPw) {
          throw new AuthenticationError('Username or Password incorrect')
      }
      const token = signToken(user);
      return { token, user };
  },
    // mutation to save a book given arguements and context //
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: {savedBooks: book} },
              { new: true }
          )
          return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!')
  },
    // mutation to remove a book given arguements and context //
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
              {_id: context.user._id},
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
          )
          return updatedUser;
      }
  }
}
};

module.exports = resolvers;
