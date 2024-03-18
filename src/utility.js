let last = timestamp();
let now;
let dt;
function timestamp() {
    return (window.performance && window.performance.now ? window.performance.now() : new Date().getTime()) / 1000;
}

function getDT() {
    now = timestamp();
    dt = now - last;
    last = now;
    return dt;
}