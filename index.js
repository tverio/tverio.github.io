const Metalsmith  = require('metalsmith');
const markdown    = require('metalsmith-markdown');
const layouts     = require('metalsmith-layouts');
const permalinks  = require('metalsmith-permalinks');
const debug       = require('metalsmith-debug');
const assets      = require('metalsmith-assets');
const robots      = require('metalsmith-robots');
const sitemap     = require('metalsmith-mapsite');
const htmlmin     = require('metalsmith-html-minifier');
const browserSync = require('metalsmith-browser-sync');
const publish = require('metalsmith-publish');


const NODE_ENV = process.env.NODE_ENV;
const ms =  Metalsmith(__dirname);

ms.metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .clean(true)
  .source('./src')
  .destination('./build')
  .use(debug())
  .use(markdown())
  .use(permalinks())
  .use(publish({
    draft: true
  }))
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(robots({
    useragent: '*',
    allow: ['/']
  }))
  .use(sitemap('http://tver.io'))
  .use(assets({
    source: './assets',
    destination: './assets'
  }))
  .use(htmlmin('*.html'));

if (NODE_ENV === 'development') {
  ms.use(browserSync({
    server: 'build',
    files: ['src/**/*.md', 'layouts/*.html']
  }));
}
  
ms.build(function(err, files) {
  if (err) { throw err; }
});
