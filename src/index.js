/* @flow */

'use strict';

import { PathPiece, fromPiece, toPiece } from './pathPiece';
import { types, registerPieceType } from './types';

var routes = [];
var mode = null;
var root = '/';
var interval = null;

var getFragment = function() {
    var fragment = '';
    if(mode === 'history') {
        fragment = cleanPath(decodeURI(location.pathname + location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = root != '/' ? fragment.replace(root, '') : fragment;
    } else {
        var match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
    }
    return cleanPath(fragment);
};

var cleanPath = function(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '').replace(/\/+/, '/');
};

var config = function(options) {
    mode = options && options.mode &&
        options.mode == 'history' &&
        !!(history.pushState) ? 'history' : 'hash';
    root = options && options.root ? '/' + cleanPath(options.root) + '/' : '/';
    return this;
};

var add = function(route, resource) {
    routes.push({ pieces: route.split('/'), resource: resource });
    return this;
};

var matchDynamicPiece = function (type, data) {
    if (!types[type]) {
        throw Error ('Piece type ' + type + 'is unknown.');
    }
    return fromPiece(types[type])(data);
};

var toPieces = function (fragment) {
    return fragment.split('/');
};

var match = function(f) {
    var fragment = f || getFragment();
    var pieces = toPieces(fragment);
    var values = [];
    var value;
    var staticFail = false;
    var dynamicFail = false;

    for(var i=0; i < routes.length; i++) {
        staticFail = false;
        for (var j = 0; j < routes[i].pieces.length; j++) {
            if (routes[i].pieces[j].match(/^#/) !== null) {
                value = matchDynamicPiece(routes[i].pieces[j].match(/^#(.*)/)[1], pieces[j]);
                if (value === null) { dynamicFail = true; break; }
                values.push(value);
            } else if (routes[i].pieces[j].match(pieces[j]) === null) {
                staticFail = true;
                break;
            }
        }

        if ((!staticFail && !dynamicFail) || values.length) {
            return routes[i].resource.apply(null, values);
        }
    }

    return null;
};

var show404 = function () {
    alert("Error 404: Page not found!");
};

var listen = function() {
    var resourceFn;
    var current = getFragment();
    var fn = function() {
        if(current !== getFragment()) {
            current = getFragment();
            resourceFn = match(current);

            if (resourceFn === null) {
                show404();
            } else {
                resourceFn();
            }
        }
    };
    clearInterval(interval);
    interval = setInterval(fn, 50);
    return this;
};

var flush = function() {
    routes = [];
    mode = null;
    root = '/';
};

export var Routes = {
    config: config,
    add: add,
    listen: listen,
    flush: flush,
    fromPathPiece: fromPiece,
    toPathPiece: toPiece,
    registerPieceType: registerPieceType,

    PathPiece: PathPiece,
    types: types
};
