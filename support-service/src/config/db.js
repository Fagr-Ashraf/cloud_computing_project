const mongoose = require('mongoose');

async function connectToMongo(mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = { connectToMongo };

