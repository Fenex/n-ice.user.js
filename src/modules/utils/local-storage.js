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
