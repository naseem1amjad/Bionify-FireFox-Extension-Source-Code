browser.browserAction.onClicked.addListener(function(tab){
    browser.tabs.executeScript(null, {file: "content_script.js"});
});
