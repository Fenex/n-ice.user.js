// ==UserScript==
// @author      Vitaliy Busko
// @name        n-ice UserJS
// @version     1.0.0
// @description Adds position change from last view to current time at TOP-100 table on n-ice.org
// @match       http://www.n-ice.org/openttd/highscore.php
// @include     http://www.n-ice.org/openttd/highscore.php
// @match       http://www.n-ice.org/openttd/highscoretop100.php
// @include     http://www.n-ice.org/openttd/highscoretop100.php
// ==/UserScript==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require('./modules/player');
var LS = require('./modules/utils/local-storage');

if(!/openttd\/highscore(top100)?\.php/.test(location.href)) {
    return;
}

var ranktable = document.querySelectorAll('table.ranktable');
if(!ranktable.length)
    return;

for(var k=0; k<ranktable.length; k++) {
    var caption = ranktable[k].getElementsByTagName('caption')[0].textContent;
    LS.setPrefixLS(caption);
    
    var tbody = ranktable[k].getElementsByTagName('tbody')[0];
    
    var cache = LS.getJSON('players');
    var last = parseInt(LS.get('last'));
    if(!cache || !last) {
        var players = [];
        
        var tr = tbody.getElementsByTagName('tr');
        for(var i=0; i<tr.length; i++)
            players.push(Player.LoadFromHTML(tr[i]));
        LS.setJSON('players', players);
        
        last = new Date().getTime();
        LS.set('last', last);
    } else {
        var tr = tbody.getElementsByTagName('tr');
        for(var i=0; i<tr.length; i++) {
            var player = Player.LoadFromHTML(tr[i]);
            for(var j=0; j<cache.length; j++) {
                if(cache[j].login == player.login) {
                    player.compare(cache[j], tr[i]);
                    break;
                }
            }
        }
    }
    
    var DIV_TS = require('./modules/ui')(ranktable[k]);
    DIV_TS.innerHTML = new Date(last).toLocaleString();
}


},{"./modules/player":2,"./modules/ui":3,"./modules/utils/local-storage":4}],2:[function(require,module,exports){
var node = {
    rank: function(row) {
        return row.getElementsByTagName('th')[0];
    },
    login: function(row) {
        return row.getElementsByTagName('td')[0];
    },
    score: function(row) {
        return row.getElementsByTagName('th')[1];
    }
};

var Player = function(data) {
    this.login = null;
    this.rank = null;
    this.score = null;
};

Player.prototype.compare = function(player, row) {
    var compare_values = {
        'rank': -1,
        'score': 1
    };
    
    for(var key in compare_values) {
        if(this[key] != player[key]) {
            var elem = node[key](row);
            var span = createDiffElement((this[key] - player[key]) * compare_values[key]);
            elem.appendChild(span);
        }
    }
};

Player.prototype.toString = function() {
    return '[object Player `'+this.login+'`]';
};

function createDiffElement(diff) {
    var span = document.createElement('span');
    span.className = "amount-diff";
    var inner = ['(', '<span class="', void 0, '">', void 0, '</span>', ')'];
    inner[2] = diff > 0 ? 'diff-up' : 'diff-down';
    inner[4] = (diff > 0 ? '+' : '') + diff;
    span.innerHTML = inner.join("");
    return span;
}

function LoadFromHTML(row) {
    var data = {
        rank: parseInt(node.rank(row).textContent),
        login: node.login(row).textContent,
        score: parseInt(node.score(row).textContent)
    };
    
    var p = new Player(data);
    
    for(var key in data)
        p[key] = data[key];
    
    return p;
}

module.exports = {
    LoadFromHTML: LoadFromHTML
};

},{}],3:[function(require,module,exports){
var LS = require('./utils/local-storage');

var class_diff_ts = 'diff-timestamp';

function insertStyle() {
    var style = document.createElement('style');
    style.innerHTML = '.diff-up{color: green;}.diff-down {color: brown;}.amount-diff{margin: 0px 1px;padding: 0px 3px;}';
    document.head.appendChild(style);
}

function insertHead(ranktable) {
    var div = document.createElement('div');
    div.innerHTML = 'Show amount values change from timestamp: <b class="'+class_diff_ts+'">now</b>. ';
    
    var btn = document.createElement('button');
    btn.innerHTML = 'Set timestamp to now';
    btn.setAttribute('LS-key', ranktable.getElementsByTagName('caption')[0].textContent);
    btn.addEventListener('click', function(event) {
        LS.setPrefixLS(event.target.getAttribute('LS-key'));
        LS.remove('last');
        LS.remove('players');
        location.reload();
    });
    div.appendChild(btn);
    
    ranktable.parentNode.insertBefore(div, ranktable.previousSibling.previousSibling);
    
    return div.getElementsByClassName(class_diff_ts)[0];
}

function init(ranktable) {
    insertStyle();
    return insertHead(ranktable);
}

module.exports = init;
},{"./utils/local-storage":4}],4:[function(require,module,exports){
var prefix = 'FNX_';


/** PRIVATE **/

function log(e) {
    console.info('local-storage module: ', e);
}

//get UNIX-timestamp in seconds
function time() {
    return Math.floor(new Date().getTime() / 1000);
}

function id(key) {
    return prefix + key;
}


/** PUBLIC **/

function has(key) {
    return localStorage[id(key)] !== void 0;
}

function empty(key) {
    return localStorage[id(key)] === void 0;
}

function get(key, defVal) {
    if(!has(key))
        return defVal;
        
    return localStorage[id(key)];
}

function getJSON(key, defVal) {
    var val = get(key, defVal)
    if(typeof val != 'string')
        return val;
    
    var json = null;
    try {
        json = JSON.parse(val);
    } catch (e) {
        log(e);
        json = defVal;
    }
    return json;
}

function remove(key) {
    delete localStorage[id(key)];
}

function set(key, value) {
    return localStorage[id(key)] = value;
}

function setJSON(key, value) {
    return set(key, JSON.stringify(value));
}

function loadCache(key, defVal) {
    if(!has(key)) return defVal;
    var json = getJSON(key, {});
    if(typeof json == 'object' && json.t > time()) {
        return json.v;
    } else {
        remove(key);
        return defVal;
    }
}

function saveCache(key, value, duration/** in seconds **/) {
    return setJSON(key, {
        t: time() + duration,
        v: value
    });
}

function setPrefixLS(p) {
    prefix = p;
}

module.exports = {
    Cache: {
        load: loadCache,
        save: saveCache
    },
    has: has,
    empty: empty,
    get: get,
    set: set,
    remove: remove,
    getJSON: getJSON,
    setJSON: setJSON,
    setPrefixLS: setPrefixLS
};

},{}]},{},[1]);
