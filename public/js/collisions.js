function checkGroups (a, b) {
    var i, j, pa, pb;

    for (i = 0; i < a.length; i ++) {
        for (j = 0; j < b.length; j ++) {
            pa = a[i].position || a[i];
            pb = b[j].position || b[j];

            if (
                (pa.x > pb.x - 1) &&
                (pa.x < pb.x + 1) &&
                (pa.y > pb.y - 1) &&
                (pa.y < pb.y + 1) &&
                (Math.abs(pa.x - pb.x) < 1) &&
                (Math.abs(pa.y - pb.y) < 1)
            ) {
                return {
                    x: pa.x,
                    y: pa.y
                };
            }

        }
    }

    return null;
}

function check(snake, walls, items) {
    return checkGroups(snake, walls, 'walls')
        .concat(checkGroups(snake, items, 'items'));
}


module.exports = checkGroups;
