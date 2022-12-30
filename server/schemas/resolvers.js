const { User } = require('../models');
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: { 
    // query to get user //
    me: async (parent, args, context) => {
      if (context.user) {
        // find user by user id //
        const foundUser = await User.findOne({ _id: context.user._id }).select("-__v -password")
        return foundUser;
      }
      throw new AuthenticationError("Need to be logged in!")
    },
  },
  Mutation: {
    // mutation to login user given an email and password //
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("User not found")
      }
      const iscorrectPW = await user.isCorrectPassword(password);
      if (!iscorrectPW) {
        throw new AuthenticationError("Incorrect Password")
      } // assign JWT to user //
      const token = signToken(user);
      return { token, user };
    },
    // mutation to create a user given the above arguements //
    addUser: async (parent, args) => {
      const user = await User.create(args);
      if (!user) {
        throw new AuthenticationError("Something went wrong!")
      }
      const token = signToken(user);
      return { token, user };
    }, 
    // mutation to save a book given arguements and context //
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please sign in and try again")
    },
    // mutation to remove a book given arguements and context //
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.body } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("No user found with this id")
    }

  },
};

module.exports = resolvers;
