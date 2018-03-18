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
