var tasks = [];
var isPause = false;

setInterval(function () {
    var i = 0;

    if (isPause) {
        return;
    }

    for (; i < tasks.length; i ++) {
        tasks[i]();
    }
}, 1000 / 60);

function pause() {
    isPause = !isPause;
}

function add(fn) {
    tasks.push(fn);
}

function remove (fn) {
    var index = tasks.indexOf(fn);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
}

module.exports = {
    add: add,
    remove: remove,
    pause: pause
};
