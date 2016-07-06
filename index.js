var canvasElement = document.querySelector("canvas");
var canvas = canvasElement.getContext('2d');
var input = document.querySelector("#input");
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
            blit.data[start + 0] = Math.min(r, 255);
            blit.data[start + 1] = Math.min(g, 255);
            blit.data[start + 2] = Math.min(b, 255);
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
    function build_function(input) {
        var s = "(function (x, y, t) {\n            " + input + "\n            if (result.r != undefined) {\n                return result;\n            } else {\n                return {r: result, g: result, b: result};\n            }\n        })";
        return s;
    }
    err_input.value = "";
    try {
        draw_animated_fn(256, 256, eval(build_function(input.value)));
    }
    catch (e) {
        err_input.value = "" + e;
    }
};
rand_button.onclick = function () {
    var r = window.gen().eval();
    var g = window.gen().eval();
    var b = window.gen().eval();
    input.value = "var result = {\n  r: " + r + ",\n  g: " + g + ",\n  b: " + b + "\n};";
    submit_button.click();
};
rand_button.click();
var saved = [
    "var result = {r: 0, g: ((t * (x - ((y + x) & x))) + t), b: (t + (x & (t & y)))};",
    "var result = { r: ((t / (y & x)) * x), g: (x / (x & y)), b: ((t ^ t) / (y | (t + ((x - (x + x)) - x)))) };",
    "var result = { r: (x & (y + ((y ^ t) ^ t))), g: (((x ^ y) + ((x | x) & t)) % (y + x)), b: (t | (t / x)) };",
];
