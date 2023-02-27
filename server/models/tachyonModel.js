const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://jon19200:2010@tachyon.obvgsic.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'Tachyon'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));


const pageSchema = new mongoose.Schema({
  url: String,
  title: String,
  isMobile: Boolean
});

const Page = mongoose.model('page', pageSchema);

module.exports = {
  Page
};