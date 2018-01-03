const Feed = require('rss-to-json');
const request = require('request');
const unfluff = require('unfluff');
const urlCache = {};

module.exports = class FeedParser {
  constructor(feeds, listener, onError, opts = {}) {
    this.feeds = feeds || [];
    this.listener = listener || (() => {});
    this.onError = onError || (() => {});
    this.feeds.forEach((url)=>this.readFeed(url));
    this.timeout = opts.timeout || 10000;
  }

  readFeed(url) {
    Feed.load(url)
      .then((rss) => {
        const cache = [];
        urlCache[url] = urlCache[url] || [];
        rss.items.forEach(item => {
          cache.push(item.url);
          if(!urlCache[url].includes(item.url)) {
            request(item.url, (err, resp, body)=>{
              this.listener(this.extract(body));
            });
          }
        });
        urlCache[url] = cache;
        setTimeout(()=>this.readFeed(url), this.timeout)
      })
      .catch(this.onError)
  }

  extract(html) {
    // TODO: implement better extract method
    return unfluff(html);
  }
};
