var app = require('koa')(),
    browserify = require('koa-browserify'),
    stat = require('koa-static'),
    fs = require('fs'),
    server;

app.use(browserify({
    root: './public',
    debug: true
}));

app.use(stat('./public'));

app.use(function *() {
    this.type = 'text/html';
    this.body = fs.createReadStream('./public/index.html');
});

app.listen(Number(process.env.PORT || 3000));