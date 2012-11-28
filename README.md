# Maxtabs

Allows you to have a maximum (default 15) number of tabs open. After that,
clicking on links to open new tabs or opening new windows with new URLs
will cause the URL to be remembered but not displayed.  When you reduce
your number of open tabs, stored URLs will be automatically re-opened in
new tabs.

The extension installs a (right-click) context menu that lets you disable
it. When the extension is disabled, all saved URLs will immediately be
re-opened in the order they were originally clicked.

Note that the extension starts in the disabled state so as not to surprise
users when it starts removing excess tabs.

When the extension is enabled (via the context menu), if you have too many
tabs open it will close as many tabs as needed (choosing the right-most
tabs in your window(s)) to get you down to the maximum number.  The URLs
for tabs that are closed will be remembered and restored once you further
reduce the number of open tabs you have.

## Why?

This extension aims to limit the amount of memory consumed by Chrome.

## Installation from a bundled .crx file

You should be able to easily install the extension by visting
https://fluiddb.fluidinfo.com/about/maxtabs/fluidinfo.com/chrome.crx

## Installation from source

* Download the repo: `git clone http://github.com/terrycojones/maxtabs`
* In chrome, go to `chrome://extensions`
* Click on `Developer mode`
* Click on `Load Unpacked Extension...`
* Navigate to the directory where you cloned the repo and click `Open`

## Internals

You can change the maximum number of tabs (`MT.maxTabs`)
in background.js

Look at the console log for the extension background page to see
information about what's going on.  To see the console, go to
`chrome://extensions` and click the `_generated_background_page.html` link
next to the Maxtabs extension.
