const FeedParser = require('./index');
const feeds = require('./feed.json');

const onData = article => {
  console.log(article.title);
};
new FeedParser(feeds, onData, console.error);
