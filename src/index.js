/* @flow */

var Routes = {};

(function () {

    "use strict";

    var routes = [];
    var mode = null;
    var root = '/';
    var interval = null;
    var pieceTypes = {};

    function PathPiece(fromPathPiece, toPathPiece) {
        this.fromPathPiece = fromPathPiece;
        this.toPathPiece = toPathPiece;
    }

    var toPathPiece = function (dict) { 
        return dict.toPathPiece; 
    };

    var fromPathPiece = function (dict) {
        return dict.fromPathPiece;
    };
    
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

    var pieces = function (pieceTyp) {
        pieceTypes = pieceTyp;
    };

    var add = function(route, resource) {
        routes.push({ pieces: route.split('/'), resource: resource });
        return this;
    };

    var matchDynamicPiece = function (type, data) {
        return fromPathPiece(type)(data);
    };

    var match = function(f) {
        var fragment = f || getFragment();
        var pieces = toPieces(fragment);
        var values = [];
        var value;

        for(var i=0; i < routes.length; i++) {
            for (var j = 0; j < routes[i].pieces.length; j++) {
                if (routes[i].pieces[j].match(/^#/) !== null) {
                    value = matchDynamicPiece(routes[i].pieces[j].match(/^#(.*)/)[1], pieces[j]);
                    if (value === null) { break; }
                    values.push(value);
                } else if (routes[i].pieces[j].match(pieces[j]) === null) {
                    break;
                }
            }

            return routes[i].resource.apply(null, values);
        }

        return null;
    };

    var listen = function() {
        var self = this;
        var resouceObj;
        var current = getFragment();
        var fn = function() {
            if(current !== getFragment()) {
                current = getFragment();
                resouceObj = match(current);
                
                if (resouceObj === null) {
                    show404();
                } else {
                    resouceObj.handle();
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

    Routes = {
        pieces: pieces,
        add: add,
        listen: listen,
        flush: flush,

        PathPiece: PathPiece
    };
})();
