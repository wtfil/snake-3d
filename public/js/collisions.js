var slice = [].slice;
var items = [];

function checkGroups (a, b, name) {
    var collisions = [];
    var i, j;

    for (i = 0; i < a.length; i ++) {
        for (j = 0; j < b.length; j ++) {

            if (
                (a[i].position.x > b[j].position.x) &&
                (a[i].position.x < b[j].position.x + 1) &&
                (a[i].position.y > b[j].position.y) &&
                (a[i].position.y < b[j].position.y + 1)
            ) {
                collisions.push({
                    name: name,
                    position: {
                        x: a[i].position.x,
                        y: a[i].position.y
                    }
                });
            }

        }
    }

    return collisions;
}

function check(snake, walls, items) {
    return checkGroups(snake, walls, 'walls')
        .concat(checkGroups(snake, items, 'items'));
}


module.exports = function (snake, walls) {
    return check(snake, walls, items);
}
