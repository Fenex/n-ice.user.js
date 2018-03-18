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

