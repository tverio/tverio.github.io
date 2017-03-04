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
  .clean(true)
  .source('./src')
  .destination('./build')
  .use(debug())
  .use(markdown())
  .use(permalinks())
  .use(publish({
    draft: true
  }))
  .use(collections())
  .use((files, metalsmith, done)=> {
    // collection fix path
    if (!metalsmith._metadata.collections) {
      return;
    }
    Object.keys(metalsmith._metadata.collections)
      .filter(name => name !== 'metadata')
      .forEach(name => {
        const p = metalsmith._metadata.collections[name];
        p.forEach(meta => {
          meta.path = meta.path.replace(/\/index\.html$/, '');
        });
      });
    done();
  })
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
