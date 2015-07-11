var ACCURACY = 0.1;

function checkGroups (a, b) {
    var i, j, pa, pb;

    for (i = 0; i < a.length; i ++) {
        for (j = 0; j < b.length; j ++) {
            pa = a[i].position || a[i];
            pb = b[j].position || b[j];

            if (
                (pa.x > pb.x - 1 - ACCURACY) &&
                (pa.x < pb.x + 1 + ACCURACY) &&
                (pa.y > pb.y - 1 - ACCURACY) &&
                (pa.y < pb.y + 1 + ACCURACY) &&
                (Math.abs(pa.x - pb.x) < 1 - ACCURACY) &&
                (Math.abs(pa.y - pb.y) < 1 - ACCURACY)
            ) {
                return {
					a: {x: pa.x, y: pa.y},
					b: {x: pb.x, y: pb.y}
                };
            }

        }
    }

    return null;
}

module.exports = checkGroups;
