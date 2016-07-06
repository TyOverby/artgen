var canvasElement = document.querySelector("canvas");
var canvas = canvasElement.getContext('2d');
var red_input = document.querySelector("#red-input");
var green_input = document.querySelector("#green-input");
var blue_input = document.querySelector("#blue-input");
var err_input = document.querySelector("#error");
var rand_button = document.querySelector("#rand");
var submit_button = document.querySelector("#submit");
function draw_with_fn(w, h, f) {
    var blit = canvas.createImageData(w, h);
    canvasElement.width = w;
    canvasElement.height = h;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var _a = f(x, y), r = _a.r, g = _a.g, b = _a.b;
            var start = x * w * 4 + y * 4;
            blit.data[start + 0] = r % 256;
            blit.data[start + 1] = g % 256;
            blit.data[start + 2] = b % 256;
            blit.data[start + 3] = 255;
        }
    }
    canvas.putImageData(blit, 0, 0);
}
var animation_requested = -1;
function draw_animated_fn(w, h, f) {
    if (animation_requested != 0) {
        window.cancelAnimationFrame(animation_requested);
    }
    var ticks = 0;
    function tick() {
        draw_with_fn(w, h, function (x, y) { return f(x, y, ticks); });
        ticks += 1;
        if (ticks != 256) {
            animation_requested = window.requestAnimationFrame(tick);
        }
        else {
            animation_requested = -1;
        }
    }
    tick();
}
draw_animated_fn(256, 256, function (x, y, t) {
    var c = x ^ y;
    return {
        r: c,
        g: c,
        b: t
    };
});
submit_button.onclick = function () {
    function build_function(r, g, b) {
        var s = "(function (x, y, t) {\n            return { r: " + r + ", g: " + g + ", b: " + b + ",\n            };\n        })";
        return s;
    }
    var r = red_input.value;
    var g = green_input.value;
    var b = blue_input.value;
    try {
        draw_animated_fn(256, 256, eval(build_function(r, g, b)));
    }
    catch (e) {
        err_input.value = "" + e;
    }
};
rand_button.onclick = function () {
    red_input.value = window.gen().eval();
    green_input.value = window.gen().eval();
    blue_input.value = window.gen().eval();
    submit_button.click();
};
