var tasks = [];

setInterval(function () {
    var i = 0;
    for (; i < tasks.length; i ++) {
        tasks[i]();
    }
}, 1000 / 60);

module.exports = {
    add: tasks.push.bind(tasks)
};
