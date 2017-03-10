/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rand_1 = __webpack_require__(1);
function draw_with_fn(canvas, w, h, colormap, f) {
    var blit = canvas.createImageData(w, h);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var c = Math.abs(f(x, y) % 255);
            if (c === NaN)
                c = 0;
            var r = colormap[c * 3 + 0];
            var g = colormap[c * 3 + 1];
            var b = colormap[c * 3 + 2];
            var start = x * w * 4 + y * 4;
            blit.data[start + 0] = r;
            blit.data[start + 1] = g;
            blit.data[start + 2] = b;
            blit.data[start + 3] = 255;
        }
    }
    canvas.putImageData(blit, 0, 0);
}
exports.draw_with_fn = draw_with_fn;
function draw_animated_fn(canvas, w, h, colormap, f, done) {
    var ticks = 0;
    function tick() {
        draw_with_fn(canvas, w, h, colormap, function (x, y) { return f(x, y, ticks); });
        ticks += 1;
        if (ticks != 256) {
            window.requestAnimationFrame(tick);
        }
        else {
            done();
        }
    }
    tick();
}
function cycler(canvas, w, h, colormap) {
    var ast = rand_1.gen();
    var ast_eval = ast.eval();
    console.log(ast_eval);
    var func = eval("(function(x, y, t) { return " + ast_eval + " })");
    draw_animated_fn(canvas, w, h, colormap, func, function () {
        cycler(canvas, w, h, colormap);
    });
}
exports.cycler = cycler;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function gen() {
    function generate_program() {
        function get(w) {
            var total = w.map(function (a) { return a[0]; }).reduce(function (a, b) { return a + b; });
            var rand = Math.random() * total;
            var counter = 0;
            for (var _i = 0, w_1 = w; _i < w_1.length; _i++) {
                var e = w_1[_i];
                counter += e[0];
                if (rand < counter) {
                    return e[1];
                }
            }
            return w[w.length - 1][1];
        }
        var weights = [
            [8.0, function () { return new Variable('x'); }],
            [8.0, function () { return new Variable('y'); }],
            [8.0, function () { return new Variable('t'); }],
            [2.0, function () { return new Add(generate_program(), generate_program()); }],
            [2.0, function () { return new Sub(generate_program(), generate_program()); }],
            [0.5, function () { return new Min(generate_program(), generate_program()); }],
            [0.5, function () { return new Max(generate_program(), generate_program()); }],
            [1.0, function () { return new Mul(generate_program(), generate_program()); }],
            [0.0, function () { return new Div(generate_program(), generate_program()); }],
            [3.0, function () { return new And(generate_program(), generate_program()); }],
            [3.0, function () { return new Or(generate_program(), generate_program()); }],
            [3.0, function () { return new Xor(generate_program(), generate_program()); }],
            [3.0, function () { return new Mod(generate_program(), generate_program()); }],
        ];
        return get(weights)();
    }
    var fin = null;
    do {
        fin = generate_program();
    } while (fin.count_nodes() < 5 || fin.count_nodes() > 30 || fin.eval().indexOf('t') === -1);
    return fin;
}
exports.gen = gen;
var BinOp = (function () {
    function BinOp(op, x, y) {
        this.x = x;
        this.y = y;
        this.op = op;
    }
    BinOp.prototype.eval = function () {
        return "(" + this.x.eval() + " " + this.op + " " + this.y.eval() + ")";
    };
    ;
    BinOp.prototype.count_nodes = function () {
        return 1 + this.x.count_nodes() + this.y.count_nodes();
    };
    BinOp.prototype.max_depth = function () {
        return 1 + Math.max(this.x.max_depth(), this.y.max_depth());
    };
    return BinOp;
}());
var FnOp = (function () {
    function FnOp(op, x, y) {
        this.x = x;
        this.y = y;
        this.op = op;
    }
    FnOp.prototype.eval = function () {
        return "(" + this.op + "(" + this.x.eval() + ", " + this.y.eval() + "))";
    };
    ;
    FnOp.prototype.count_nodes = function () {
        return 1 + this.x.count_nodes() + this.y.count_nodes();
    };
    FnOp.prototype.max_depth = function () {
        return 1 + Math.max(this.x.max_depth(), this.y.max_depth());
    };
    return FnOp;
}());
var Variable = (function () {
    function Variable(v) {
        this.v = v;
    }
    Variable.prototype.eval = function () {
        return this.v;
    };
    Variable.prototype.count_nodes = function () {
        return 1;
    };
    Variable.prototype.max_depth = function () {
        return 1;
    };
    return Variable;
}());
var Min = (function (_super) {
    __extends(Min, _super);
    function Min(x, y) {
        return _super.call(this, 'Math.min', x, y) || this;
    }
    return Min;
}(FnOp));
var Max = (function (_super) {
    __extends(Max, _super);
    function Max(x, y) {
        return _super.call(this, 'Math.max', x, y) || this;
    }
    return Max;
}(FnOp));
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(x, y) {
        return _super.call(this, '+', x, y) || this;
    }
    return Add;
}(BinOp));
var Sub = (function (_super) {
    __extends(Sub, _super);
    function Sub(x, y) {
        return _super.call(this, '-', x, y) || this;
    }
    return Sub;
}(BinOp));
var Mul = (function (_super) {
    __extends(Mul, _super);
    function Mul(x, y) {
        return _super.call(this, '*', x, y) || this;
    }
    return Mul;
}(BinOp));
var Div = (function (_super) {
    __extends(Div, _super);
    function Div(x, y) {
        return _super.call(this, '/', x, y) || this;
    }
    return Div;
}(BinOp));
var Or = (function (_super) {
    __extends(Or, _super);
    function Or(x, y) {
        return _super.call(this, '|', x, y) || this;
    }
    return Or;
}(BinOp));
var And = (function (_super) {
    __extends(And, _super);
    function And(x, y) {
        return _super.call(this, '&', x, y) || this;
    }
    return And;
}(BinOp));
var Xor = (function (_super) {
    __extends(Xor, _super);
    function Xor(x, y) {
        return _super.call(this, '^', x, y) || this;
    }
    return Xor;
}(BinOp));
var Mod = (function (_super) {
    __extends(Mod, _super);
    function Mod(x, y) {
        return _super.call(this, '%', x, y) || this;
    }
    return Mod;
}(BinOp));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = __webpack_require__(0);
var canvasElement = document.querySelector("canvas");
var canvas = canvasElement.getContext('2d');
canvasElement.width = 255;
canvasElement.height = 255;
var colormap = [66, 9, 85, 67, 10, 87, 68, 11, 88, 67, 14, 89, 68, 14, 90, 69, 16, 92, 69, 17, 93, 68, 18, 95, 69, 19, 96, 70, 21, 96, 70, 22, 98, 70, 24, 99, 70, 24, 100, 70, 25, 102, 70, 27, 103, 70, 28, 104, 71, 29, 105, 71, 30, 106, 72, 32, 108, 72, 33, 109, 72, 34, 110, 72, 36, 111, 72, 37, 112, 71, 37, 113, 70, 39, 114, 71, 40, 115, 71, 41, 116, 71, 42, 117, 71, 43, 118, 71, 45, 119, 70, 46, 120, 69, 46, 121, 70, 48, 121, 70, 50, 122, 70, 51, 123, 68, 52, 124, 69, 53, 125, 69, 54, 124, 68, 55, 126, 67, 56, 127, 68, 57, 126, 66, 59, 128, 67, 59, 129, 67, 60, 128, 65, 62, 130, 66, 62, 129, 66, 64, 130, 64, 66, 131, 65, 66, 132, 64, 67, 131, 64, 68, 133, 64, 69, 133, 63, 70, 132, 62, 73, 134, 63, 73, 133, 62, 74, 134, 62, 75, 135, 62, 76, 135, 61, 77, 134, 61, 78, 136, 60, 79, 136, 59, 80, 136, 59, 81, 135, 58, 82, 136, 58, 83, 137, 58, 84, 137, 57, 85, 137, 56, 86, 137, 56, 87, 137, 56, 88, 138, 56, 89, 138, 56, 90, 138, 55, 91, 138, 54, 92, 138, 54, 93, 137, 53, 94, 138, 53, 95, 139, 53, 96, 139, 52, 97, 139, 52, 98, 139, 51, 99, 139, 50, 100, 139, 51, 101, 139, 51, 102, 139, 50, 103, 139, 50, 104, 139, 49, 105, 139, 50, 106, 139, 48, 107, 140, 49, 108, 141, 49, 109, 141, 48, 110, 141, 47, 110, 141, 47, 111, 141, 48, 112, 141, 48, 112, 141, 47, 113, 141, 46, 115, 141, 45, 115, 141, 46, 116, 141, 45, 118, 141, 45, 118, 141, 45, 119, 141, 44, 121, 141, 45, 122, 141, 45, 121, 141, 43, 122, 141, 44, 123, 141, 44, 124, 141, 42, 125, 141, 43, 126, 141, 43, 127, 141, 42, 128, 141, 43, 129, 140, 42, 130, 139, 42, 131, 140, 42, 132, 140, 41, 133, 140, 41, 134, 140, 42, 135, 140, 41, 136, 140, 41, 136, 140, 41, 137, 140, 40, 138, 140, 40, 139, 139, 40, 140, 138, 40, 141, 139, 40, 142, 139, 40, 143, 139, 39, 144, 139, 39, 145, 139, 39, 146, 138, 40, 147, 139, 40, 148, 139, 39, 149, 138, 39, 150, 138, 39, 151, 138, 39, 151, 138, 39, 151, 137, 39, 152, 136, 40, 153, 137, 40, 154, 136, 40, 155, 135, 40, 156, 136, 40, 157, 135, 40, 158, 134, 39, 159, 135, 41, 160, 134, 41, 161, 133, 40, 162, 132, 42, 163, 133, 41, 163, 133, 42, 164, 132, 43, 166, 132, 44, 165, 132, 44, 166, 131, 45, 168, 130, 46, 169, 129, 46, 169, 130, 47, 171, 128, 47, 172, 127, 48, 172, 128, 49, 173, 127, 50, 174, 126, 51, 175, 125, 53, 175, 125, 53, 176, 124, 54, 177, 123, 56, 178, 124, 57, 179, 123, 59, 180, 122, 60, 181, 121, 61, 182, 120, 62, 183, 119, 63, 183, 119, 65, 184, 118, 67, 185, 117, 68, 186, 116, 69, 187, 116, 71, 188, 115, 73, 188, 114, 74, 189, 113, 76, 190, 112, 78, 191, 111, 80, 192, 110, 81, 192, 109, 83, 193, 108, 85, 194, 107, 87, 195, 106, 89, 195, 105, 91, 196, 104, 92, 196, 103, 94, 197, 102, 97, 198, 101, 99, 198, 100, 101, 199, 99, 102, 200, 98, 105, 201, 97, 107, 202, 96, 108, 201, 95, 111, 203, 93, 113, 204, 92, 115, 203, 91, 118, 205, 90, 120, 206, 89, 122, 205, 88, 125, 207, 87, 127, 208, 86, 129, 207, 84, 131, 209, 83, 134, 208, 82, 136, 209, 81, 139, 211, 79, 141, 210, 78, 143, 211, 78, 146, 212, 76, 149, 213, 75, 151, 212, 74, 153, 214, 73, 156, 213, 72, 158, 214, 70, 160, 214, 69, 163, 215, 68, 166, 216, 67, 168, 217, 66, 171, 216, 65, 173, 217, 64, 176, 217, 62, 179, 218, 62, 181, 219, 61, 184, 218, 60, 187, 219, 59, 189, 219, 58, 191, 220, 58, 194, 221, 57, 196, 220, 56, 198, 221, 56, 201, 222, 56, 204, 221, 55, 206, 222, 55, 209, 223, 55, 211, 222, 54, 214, 223, 54, 217, 224, 54, 219, 223, 55, 222, 224, 55, 224, 225, 55, 227, 224, 55, 229, 225, 56, 232, 226, 56, 235, 225, 56, 236, 226, 57, 239, 227, 58, 241, 226, 59, 243, 227, 60, 245, 228, 60];
lib_1.cycler(canvas, 255, 255, colormap);


/***/ })
/******/ ]);