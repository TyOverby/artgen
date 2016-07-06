let canvasElement = document.querySelector("canvas") as HTMLCanvasElement;
let canvas = canvasElement.getContext('2d');

let red_input = document.querySelector("#red-input") as HTMLTextAreaElement;
let green_input = document.querySelector("#green-input") as HTMLTextAreaElement;
let blue_input = document.querySelector("#blue-input") as HTMLTextAreaElement;
let err_input = document.querySelector("#error") as HTMLTextAreaElement;

let rand_button = document.querySelector("#rand") as HTMLButtonElement;
let submit_button = document.querySelector("#submit") as HTMLButtonElement;

interface Color {
    r: number,
    g: number,
    b: number,
}

function draw_with_fn(w: number, h: number, f: (x: number, y: number) => Color) {
    let blit = canvas.createImageData(w, h);
    canvasElement.width = w;
    canvasElement.height = h;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let {r, g, b} = f(x, y);
            let start = x * w * 4 + y * 4;
            blit.data[start + 0] = r % 256;
            blit.data[start + 1] = g % 256;
            blit.data[start + 2] = b % 256;
            blit.data[start + 3] = 255;
        }
    }
    canvas.putImageData(blit, 0, 0);
}


let animation_requested = -1;

function draw_animated_fn(w: number, h: number, f: (x: number, y: number, t: number) => Color) {
    if (animation_requested != 0) {
        window.cancelAnimationFrame(animation_requested);
    }

    let ticks = 0;
    function tick() {
        draw_with_fn(w, h, (x, y) => f(x, y, ticks));
        ticks += 1;
        if (ticks != 256) {
            animation_requested = window.requestAnimationFrame(tick);
        } else {
            animation_requested = -1;
        }
    }
    tick();
}

draw_animated_fn(256, 256, (x, y, t) => {
    let c = x ^ y;
    return {
        r: c,
        g: c,
        b: t,
    };
});


submit_button.onclick = function () {
    function build_function (r: string, g: string, b: string): string {
        var s = `(function (x, y, t) {
            return { r: ${r}, g: ${g}, b: ${b},
            };
        })`;
        return s;
    }

    let r = red_input.value;
    let g = green_input.value;
    let b = blue_input.value;
    try {
        draw_animated_fn(256, 256, eval(build_function(r, g, b)) as any)
    } catch (e) {
        err_input.value = "" + e;
    }
};

rand_button.onclick = function () {
    red_input.value = (window as any).gen().eval();
    green_input.value = (window as any).gen().eval();
    blue_input.value = (window as any).gen().eval();
    submit_button.click();
};

var saved = [
    {
        r: "0",
        g: "0",
        b: "(((t | y) ^ x) + (t / (y & x)))",
    }
]
