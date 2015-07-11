var EventEmitter = require('events').EventEmitter;
var debounce = require('debounce');
var ee = new EventEmitter();
var touchStartX = null;

window.addEventListener('keypress', debounce(onKeyPressed, 200, true));
window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchend', onTouchEnd);

function onKeyPressed(e) {
    var code = e.keyCode;

    // 119 87 1094 1062 w
    // 115 83 1099 1067 s
    // 97 65 1092 1064 a
    // 100 68 1074 1042 d
    // 114 r
    // 112 p

    if ([100, 68, 1074, 1042].indexOf(code) !== -1) {
    	ee.emit('right');
    }

    if ([97, 65, 1064, 1092].indexOf(code) !== -1) {
    	ee.emit('left');
    }

    if ([114].indexOf(code) !== -1) {
    	ee.emit('side');
    }

    if ([112].indexOf(code) !== -1) {
    	ee.emit('pause');
    }
}

function onTouchStart(e) {
	e.preventDefault();
	touchStartX = e.changedTouches[0].pageX;
}
function onTouchEnd(e) {
	e.preventDefault();
	if (touchStartX === null) {
		return;
	}
	var diff = e.changedTouches[0].pageX - touchStartX;
	touchStartX = null;

	if (diff > 0) {
		ee.emit('right');
	} else {
		ee.emit('left');
	}
}

module.exports = ee;
