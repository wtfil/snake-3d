var fs = require('fs');
var maps = {
    simple: fs.readFileSync(__dirname + '/maps/simple', 'utf8'),
    empty: fs.readFileSync(__dirname + '/maps/empty', 'utf8')
};

function resolve(name) {
    if (!maps[name]) {
        throw new Error('map "' + name + '" does not exsist in js/levels/maps folder');
    }
    return maps[name];
}

module.exports = resolve;
