module.exports = function (fn) {
    function render() {
        requestAnimationFrame(render);
        fn();
    }
    render();
};
