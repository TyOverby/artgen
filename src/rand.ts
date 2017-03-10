export interface AstNode {
    eval(): string
    count_nodes(): number;
    max_depth(): number;
}

type Weights<T> = [number, T][]

export function gen(): AstNode {
    function generate_program(): AstNode {
        function get<T>(w: Weights<T>): T {
            let total = w.map(a => a[0]).reduce((a, b) => a + b);
            let rand = Math.random() * total;

            let counter = 0;
            for (let e of w) {
                counter += e[0];
                if (rand < counter) {
                    return e[1];
                }
            }
            return w[w.length - 1][1]
        }

        let weights: Weights<() => AstNode> = [
            [8.0, () => new Variable('x')],
            [8.0, () => new Variable('y')],
            [8.0, () => new Variable('t')],

            [2.0, () => new Add(generate_program(), generate_program())],
            [2.0, () => new Sub(generate_program(), generate_program())],
            [0.5, () => new Min(generate_program(), generate_program())],
            [0.5, () => new Max(generate_program(), generate_program())],
            [1.0, () => new Mul(generate_program(), generate_program())],
            [0.0, () => new Div(generate_program(), generate_program())],

            [3.0, () => new And(generate_program(), generate_program())],
            [3.0, () => new Or(generate_program(), generate_program())],
            [3.0, () => new Xor(generate_program(), generate_program())],
            [3.0, () => new Mod(generate_program(), generate_program())],
        ];

        return get(weights)();
    }

    let fin = null;

    do {
        fin = generate_program();
    } while (fin.count_nodes() < 5 || fin.count_nodes() > 30 || fin.eval().indexOf('t') === -1);

    return fin;
}

abstract class BinOp implements AstNode {
    x: AstNode;
    y: AstNode;
    op: string;

    constructor(op: string, x: AstNode, y: AstNode) {
        this.x = x;
        this.y = y;
        this.op = op;
    }

    eval(): string {
        return `(${this.x.eval()} ${this.op} ${this.y.eval()})`
    };

    count_nodes(): number {
        return 1 + this.x.count_nodes() + this.y.count_nodes();
    }

    max_depth(): number {
        return 1 + Math.max(this.x.max_depth(), this.y.max_depth());
    }
}

abstract class FnOp implements AstNode {
    x: AstNode;
    y: AstNode;
    op: string;

    constructor(op: string, x: AstNode, y: AstNode) {
        this.x = x;
        this.y = y;
        this.op = op;
    }

    eval(): string {
        return `(${this.op}(${this.x.eval()}, ${this.y.eval()}))`
    };

    count_nodes(): number {
        return 1 + this.x.count_nodes() + this.y.count_nodes();
    }

    max_depth(): number {
        return 1 + Math.max(this.x.max_depth(), this.y.max_depth());
    }
}

class Variable implements AstNode {
    v: string;
    constructor(v: string) {
        this.v = v;
    }
    eval(): string {
        return this.v
    }
    count_nodes(): number {
        return 1;
    }

    max_depth(): number {
        return 1;
    }
}


class Min extends FnOp {
    constructor(x: AstNode, y: AstNode) {
        super('Math.min', x, y);
    }
}

class Max extends FnOp {
    constructor(x: AstNode, y: AstNode) {
        super('Math.max', x, y);
    }
}

class Add extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('+', x, y);
    }
}

class Sub extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('-', x, y);
    }
}

class Mul extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('*', x, y);
    }
}

class Div extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('/', x, y);
    }
}

class Or extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('|', x, y);
    }
}

class And extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('&', x, y);
    }
}

class Xor extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('^', x, y);
    }
}

class Mod extends BinOp {
    constructor(x: AstNode, y: AstNode) {
        super('%', x, y);
    }
}
