const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://jon19200:2010@tachyon.obvgsic.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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