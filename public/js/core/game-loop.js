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

module.exports = {
    add: tasks.push.bind(tasks),
    pause: pause
};
