'use strict';

import { PathPiece, fromPiece, toPiece } from './pathPiece';

var id = (a) => a;
var numToString = (n) => String(n);

var StringP = {
    name: 'String',
    from: id,
    to: id
};

var NumberP = {
    name: 'Number',
    from: (piece) => {
        var n = parseInt(piece, 10);
        if (isNaN(n)) { return null; } else { return n; }
    },
    to: numToString
};

var IntegerP = {
    name: 'Integer',
    from: (piece) => {
        var n = Number(piece);
        if (piece === '' ||
            isNaN(n) ||
            n < 0 ||
            parseInt(n) !== n) { return null; } else { return n; }
    },
    to: numToString
};

var typeList = [
    StringP,
    NumberP,
    IntegerP
];

export var types = typeList.reduce(function (collection, type) {
    collection[type.name] = new PathPiece(type.from, type.to);
    return collection;
});

export var registerPieceType = function(name/*: String */,
                                        fromPathPiece/*: Function */,
                                        toPathPiece/*: Function */) {
    types[name] = new PathPiece(fromPathPiece, toPathPiece);
};
