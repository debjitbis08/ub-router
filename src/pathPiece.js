'use strict';

export function PathPiece(fromPiece, toPiece) {
    this.fromPiece = fromPiece;
    this.toPiece = toPiece;
}

export var toPiece = function (type) {
    return type.toPiece;
};

export var fromPiece = function (type) {
    return type.fromPiece;
};
