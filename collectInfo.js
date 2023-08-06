// collectInfo.js
async function collectInformation(db, info) {
  // Save the information to the MongoDB collection 'information'
  const informationCollection = db.collection('information');
  try {
    const result = await informationCollection.insertOne(info);
    return result.ops[0];
  } catch (err) {
    console.error('Error while collecting information:', err);
    throw new Error('An error occurred while collecting information.');
  }
}

module.exports = {
  collectInformation,
};