const mongoose = require('mongoose');

// Enter a database link here
const MONGO_URI = '';

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

module.exports = Page;
