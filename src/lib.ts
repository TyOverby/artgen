import { gen } from "./rand";


export function draw_with_fn(
    canvas: CanvasRenderingContext2D,
    w: number, h: number,
    colormap: number[],
    f: (x: number, y: number) => number) {
    let blit = canvas.createImageData(w, h);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let c = Math.abs(f(x, y) % 255);
            if (c === NaN) c = 0;
            let r = colormap[c * 3 + 0];
            let g = colormap[c * 3 + 1];
            let b = colormap[c * 3 + 2];

            let start = x * w * 4 + y * 4;
            blit.data[start + 0] = r;
            blit.data[start + 1] = g;
            blit.data[start + 2] = b;
            blit.data[start + 3] = 255;
        }
    }
    canvas.putImageData(blit, 0, 0);
}

function draw_animated_fn(
    canvas: CanvasRenderingContext2D,
    w: number, h: number,
    colormap: number[],
    f: (x: number, y: number, t: number) => number,
    done: () => void) {
    let ticks = 0;
    function tick() {
        draw_with_fn(canvas, w, h, colormap, (x, y) => f(x, y, ticks));
        ticks += 1;
        if (ticks != 256) {
            window.requestAnimationFrame(tick);
        } else {
            done();
        }
    }

    tick();
}

export function cycler(canvas: CanvasRenderingContext2D, w: number, h: number, colormap: number[]) {
    let ast = gen();
    let ast_eval = ast.eval();
    console.log(ast_eval);
    let func = eval(`(function(x, y, t) { return ${ast_eval} })`);
    draw_animated_fn(canvas, w, h, colormap, func, () => {
        cycler(canvas, w, h, colormap);
    });
}
