import {gen} from "./rand";

export interface Color {
    r: number,
    g: number,
    b: number,
}

export function draw_with_fn(canvas: CanvasRenderingContext2D, w: number, h: number, f: (x: number, y: number) => Color) {
    let blit = canvas.createImageData(w, h);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let {r, g, b} = f(x, y);
            let start = x * w * 4 + y * 4;
            blit.data[start + 0] = Math.min(r, 255);
            blit.data[start + 1] = Math.min(g, 255);
            blit.data[start + 2] = Math.min(b, 255);
            blit.data[start + 3] = 255;
        }
    }
    canvas.putImageData(blit, 0, 0);
}

function draw_animated_fn(
    canvas: CanvasRenderingContext2D,
    w: number, h: number,
    f: (x: number, y: number, t: number) => Color,
    done: () => void) {
    let ticks = 0;
    function tick() {
        draw_with_fn(canvas, w, h, (x, y) => f(x, y, ticks));
        ticks += 1;
        if (ticks != 256) {
            window.requestAnimationFrame(tick);
        } else {
            done();
        }
    }

    tick();
}

export function cycler(canvas: CanvasRenderingContext2D, w: number, h: number) {
    let ast = gen();
    let func = eval(`function(x, y, t) { return ${ast.eval()} }`);
    draw_animated_fn(canvas, w, h, func, () => {
        cycler(canvas, w, h);
    });
}