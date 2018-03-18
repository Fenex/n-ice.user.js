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