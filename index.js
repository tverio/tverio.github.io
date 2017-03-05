'use strict';

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
const publish     = require('metalsmith-publish');
const collections = require('metalsmith-collections');
const updated     = require('metalsmith-updated');

const NODE_ENV = process.env.NODE_ENV;
const ms =  Metalsmith(__dirname);

ms.metadata({
    title: "Тверское ИТ-сообщество",
    description: "Тверское ИТ-сообщество tver.io",
    keywords: "Сообщество, ИТ, конференции в Твери, митап",
    author: "tver.io",
    image: "http://tver.io//assets/img/logo.png",
    url: "http://tver.io/",
  })
  .clean(false)
  .source('./src')
  .destination('./build')
  .use(debug())
  .use(markdown())
  .use(publish({
    draft: true
  }))
  .use(collections())
  .use(permalinks())  
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials'
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
  .use(htmlmin('*.html'))
  .use((files, metalsmith, done)=> {
    if (!files['CNAME']) {
      files['CNAME'] = {
        contents: new Buffer('tver.io')
      }
    }
    done();
  })
  .use(updated({
    updatedFile: '../.updated.json'
  }));

if (NODE_ENV === 'development') {
  ms.use(browserSync({
    server: 'build',
    files: ['src/**/*.md', 'layouts/*.html']
  }));
}
  
ms.build(function(err, files) {
  if (err) { throw err; }
});
