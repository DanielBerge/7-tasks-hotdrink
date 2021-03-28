import {addConstraint, divConstraint, multConstraint, sumConstraint} from "./constraints.js";

export const Num = Symbol('num');
export const Op = Symbol('op');
export const Field = Symbol('field')

export const lex = str => str.split(' ').map(s => s.trim());

//Credit https://github.com/mgechev/tiny-compiler/blob/master/tiny.js
export const parse = tokens => {

    let c = 0;
    const peek = () => tokens[c];
    const consume = () => tokens[c++];

    const parseNum = () => ({val: parseInt(consume()), type: Num});

    const parseField = () => ({val: consume(), type: Field})

    const parseOp = () => {
        const node = {val: consume(), type: Op, expr: []};
        while (peek()) node.expr.push(parseExpr());
        return node;
    };

    const parseExpr = () => /\d/.test(peek()[0]) ? parseNum() : (peek()[0] === peek()[0].toUpperCase() ? parseField() : parseOp());

    return parseExpr();
};

export function evaluate(ast, td) {
    const operators = {
        add: args => {
            addConstraint(args[0], args[1], td);
        },
        div: args => {
            divConstraint(args[0], args[1], td);
        },
        mult: args => {
            multConstraint(args[0], args[1], td);
        },
        sum: args => {
            sumConstraint(args[0], args[1], td);
        }
    };

    if (ast.type === Num || ast.type === Field) return ast.val;
    return operators[ast.val](ast.expr.map((value => evaluate(value, td))));
}



