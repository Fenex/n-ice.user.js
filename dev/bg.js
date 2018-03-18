chrome.tabs.onUpdated.addListener(
function(tabId, changeInfo, tab) {
	if(changeInfo.status=="complete") {
    	insertScriptsOnTab(tabId, tab.url);
	}
});

function insertScriptsOnTab(tabId, url) {
    // exec scripts on always pages
    chrome.tabs.executeScript(tabId, {file: 'build.js'});
}
