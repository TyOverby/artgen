interface AstNode {
    eval(): string
    count_nodes(): number;
    max_depth(): number;
}

type Weights<T> = [number, T][]

function gen(): AstNode {
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
            [3, () => new Variable('x')],
            [3, () => new Variable('y')],
            [3, () => new Variable('t')],

            [1, () => new Add(generate_program(), generate_program())],
            [1, () => new Sub(generate_program(), generate_program())],
            [1, () => new Mul(generate_program(), generate_program())],
            [1, () => new Div(generate_program(), generate_program())],

            [1, () => new And(generate_program(), generate_program())],
            [1, () => new Or(generate_program(), generate_program())],
            [1, () => new Xor(generate_program(), generate_program())],
            [1, () => new Mod(generate_program(), generate_program())],
        ];

        return get(weights)();
    }

    let fin = null;

    do {
        fin = generate_program();
    } while (fin.count_nodes() < 5);

    return fin;
}

abstract class BinOp implements AstNode {
    x: AstNode;
    y: AstNode;
    op: string;

    constructor(op, x, y) {
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

class Add extends BinOp {
    constructor(x, y) {
        super('+', x, y);
    }
}

class Sub extends BinOp {
    constructor(x, y) {
        super('-', x, y);
    }
}

class Mul extends BinOp {
    constructor(x, y) {
        super('*', x, y);
    }
}

class Div extends BinOp {
    constructor(x, y) {
        super('/', x, y);
    }
}

class Or extends BinOp {
    constructor(x, y) {
        super('|', x, y);
    }
}

class And extends BinOp {
    constructor(x, y) {
        super('&', x, y);
    }
}

class Xor extends BinOp {
    constructor(x, y) {
        super('^', x, y);
    }
}

class Mod extends BinOp {
    constructor(x, y) {
        super('%', x, y);
    }
}
