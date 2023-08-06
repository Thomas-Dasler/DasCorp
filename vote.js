// vote.js
async function voteForTopic(db, topicId) {
  // Update the vote count for the specified topic in the MongoDB collection 'topics'
  const topicsCollection = db.collection('topics');
  try {
    const result = await topicsCollection.updateOne(
      { _id: topicId },
      { $inc: { votes: 1 } }
    );
    if (result.modifiedCount === 1) {
      return `Voted for topic with ID ${topicId}`;
    } else {
      throw new Error('Topic not found');
    }
  } catch (err) {
    console.error('Error while voting:', err);
    throw new Error('An error occurred while voting.');
  }
}

module.exports = {
  voteForTopic,
};
