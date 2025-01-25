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
  if (score > 3) return "Readers are loving";
  if (score > 1) return "Readers really enjoy";
  if (score > 0) return "Readers like";
  if (score === 0) return "Mixed opinions about";
  if (score > -1) return "Readers are unsure about";
  return "Readers find challenging";
};