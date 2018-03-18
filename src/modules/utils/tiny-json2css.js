function json2css(obj) {
    var out = '';
    for(var selector in obj) {
        out += selector + '{';
        for(var css in obj[selector]) {
            out += css + ':' + obj[selector][css] + ' !important;';
        }
        out += '}';
    }
    return out;
}

module.exports = json2css;
