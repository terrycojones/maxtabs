var MT = {
    enabled: true,
    maxTabs: 15,
    urls: [],

    updateMenuItem: function(){
        if (this.enabled){
            chrome.contextMenus.update(
                this.menuItem, {
                    checked: true,
                    title: 'Enabled, ' + this.urls.length + ' URL' + (this.urls.length === 1 ? '' : 's') + ' saved.'
                }
            );
        }
        else {
            chrome.contextMenus.update(
                this.menuItem, {
                    checked: false,
                    title: 'Disabled, click to enable'
                }
            );
        }
    },
    
    restoreTab: function(callback){
        var tab = this.urls.splice(0, 1)[0];
        chrome.windows.get(
            tab.windowId,
            {
                populate: false
            },
            function(window){
                var options = {
                    url: tab.url
                };
                if (window.id !== chrome.windows.WINDOW_ID_NONE){
                    // The original window still exists.
                    options.windowId = tab.windowId;
                }
                chrome.tabs.create(options, function(){
                    if (callback){
                        console.log('Auto-restored tab for ' + tab.url);
                        callback();
                    }
                });
            }.bind(this)
        );
    },
    
    restoreTabs: function(options){
        chrome.tabs.query(
            {
                windowType: 'normal'
            },
            function(tabs){
                if (options.restoreAll || tabs.length < this.maxTabs){
                    if (this.urls.length){
                        this.restoreTab(function(){
                            this.restoreTabs(options);
                            this.updateMenuItem();
                        }.bind(this));
                    }
                }
            }.bind(this)
        );
    },
    
    removeTab: function(tab, callback){
        chrome.tabs.remove(tab.id, function(){
            // Don't bother saving the URLs of empty new tabs.
            if (tab.url !== 'chrome://newtab/'){
                console.log('Saved tab with url ' + tab.url);
                this.urls.push({
                    url: tab.url,
                    windowId: tab.windowId
                });
            }
            callback();
        }.bind(this));
    },
    
    removeTabs: function(){
        chrome.tabs.query(
            {
                windowType: 'normal'
            },
            function(tabs){
                if (tabs.length > this.maxTabs){
                    // Remove a tab with the maximum index.
                    var maxIndex = 0;
                    for (var i = 0; i < tabs.length; i++){
                        var tab = tabs[i];
                        if (tab.index > maxIndex){
                            maxIndex = tab.index;
                        }
                    }
                    this.removeTab(tabs[maxIndex], function(){
                        this.removeTabs();
                        this.updateMenuItem();
                    }.bind(this));
                }
            }.bind(this)
        );
    },

    init: function(){
        this.removeTabs();

        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            if (this.enabled && changeInfo.status === 'loading'){
                this.removeTabs();
            }
        }.bind(this));
        
        chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
            if (this.enabled){
                this.restoreTabs({
                    restoreAll: false
                });
            }
        }.bind(this));

        this.menuItem = chrome.contextMenus.create({
            checked: true,
            title: 'Enabled. 0 URLs saved.',
            contexts: ['all'],
            type: 'checkbox',
            onclick : function(info, tab){
                this.enabled = info.checked;
                if (this.enabled){
                    // Activated :-)
                    this.removeTabs();
                }
                else {
                    // Deactivated. Restore all tabs.
                    this.restoreTabs({
                        restoreAll: true
                    });
                }
                this.updateMenuItem();
            }.bind(this)
        });
    }
};

MT.init();
