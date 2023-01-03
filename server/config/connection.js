const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Noah:26Christmas@cluster0.tmjmyky.mongodb.net/test', {
useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false,
});

module.exports = mongoose.connection;

