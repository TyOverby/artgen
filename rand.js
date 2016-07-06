var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            [3, function () { return new Variable('x'); }],
            [3, function () { return new Variable('y'); }],
            [3, function () { return new Variable('t'); }],
            [1, function () { return new Add(generate_program(), generate_program()); }],
            [1, function () { return new Sub(generate_program(), generate_program()); }],
            [1, function () { return new Mul(generate_program(), generate_program()); }],
            [1, function () { return new Div(generate_program(), generate_program()); }],
            [1, function () { return new And(generate_program(), generate_program()); }],
            [1, function () { return new Or(generate_program(), generate_program()); }],
            [1, function () { return new Xor(generate_program(), generate_program()); }],
            [1, function () { return new Mod(generate_program(), generate_program()); }],
        ];
        return get(weights)();
    }
    var fin = null;
    do {
        fin = generate_program();
    } while (fin.count_nodes() < 5);
    return fin;
}
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
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(x, y) {
        _super.call(this, '+', x, y);
    }
    return Add;
}(BinOp));
var Sub = (function (_super) {
    __extends(Sub, _super);
    function Sub(x, y) {
        _super.call(this, '-', x, y);
    }
    return Sub;
}(BinOp));
var Mul = (function (_super) {
    __extends(Mul, _super);
    function Mul(x, y) {
        _super.call(this, '*', x, y);
    }
    return Mul;
}(BinOp));
var Div = (function (_super) {
    __extends(Div, _super);
    function Div(x, y) {
        _super.call(this, '/', x, y);
    }
    return Div;
}(BinOp));
var Or = (function (_super) {
    __extends(Or, _super);
    function Or(x, y) {
        _super.call(this, '|', x, y);
    }
    return Or;
}(BinOp));
var And = (function (_super) {
    __extends(And, _super);
    function And(x, y) {
        _super.call(this, '&', x, y);
    }
    return And;
}(BinOp));
var Xor = (function (_super) {
    __extends(Xor, _super);
    function Xor(x, y) {
        _super.call(this, '^', x, y);
    }
    return Xor;
}(BinOp));
var Mod = (function (_super) {
    __extends(Mod, _super);
    function Mod(x, y) {
        _super.call(this, '%', x, y);
    }
    return Mod;
}(BinOp));
