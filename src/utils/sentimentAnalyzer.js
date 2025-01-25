import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const analyzeReviews = (posts) => {
  const analysis = posts.map(post => ({
    ...post,
    sentiment: sentiment.analyze(post.content)
  }));

  const overallSentiment = analysis.reduce((acc, curr) => acc + curr.sentiment.score, 0) / analysis.length;

  return {
    readerMood: interpretSentiment(overallSentiment),
    analysis
  };
};

const interpretSentiment = (score) => {
  if (score > 3) return "is highly rated by readers";
  if (score > 1) return "is well received by readers";
  if (score > 0) return "has positive reader feedback";
  if (score === 0) return "has mixed reader reviews";
  if (score > -1) return "has mixed reader opinions";
  return "received critical feedback";
};