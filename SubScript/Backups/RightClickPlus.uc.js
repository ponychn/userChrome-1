// ==UserScript==
// @name			RightClickPlus.uc.js
// @description		按住右鍵新分頁打開鏈結，在鏈結上 Ctrl + 右鍵能打開選單，雙擊右鍵關閉分頁
// @homepageURL		https://github.com/Drager-oos/userChrome/blob/master/SubScript/Backups/RightClickPlus.uc.js
// ==/UserScript==
(function() {
	var Background = true;  // false: 前景 | true: 背景
	function $(id) document.getElementById(id);

	function findLink(element) {
		// Super_start
		if (element.className == 'site-snapshot') {
			return element.parentNode;
		}
		switch (element.tagName) {
			case 'A': return element;
			case 'B': case 'I': case 'SPAN': case 'SMALL':
			case 'STRONG': case 'EM': case 'BIG': case 'SUB':
			case 'SUP': case 'IMG': case 'S':
			case 'FONT':
				var parent = element.parentNode;
				return parent && findLink(parent);
			default:
				return null;
		}
	}

	gBrowser.mPanelContainer.addEventListener('click', function(e) {
		if (e.button == 2 && !e.ctrlKey) {
			var link = findLink(e.target);
			if (link) {
				var href = link.href;
				if (href && href.match(/^(https?|ftp|chrome):\/\/|^about:/)) {
					e.preventDefault();
					e.stopPropagation();
					$("contentAreaContextMenu").hidePopup();
					if (Background == true) {
						gBrowser.addTab(href);
					}
					else if (Background == false) {
						gBrowser.selectedTab = gBrowser.addTab(href);
					}
					return;
				}
			}
		}
	}, false);

	gBrowser.mPanelContainer.addEventListener("dblclick", function(e) {
		var eName = e.target.nodeName || e.target.localName || e.target.tagName;
		if (eName == "TEXTAREA" || eName == "INPUT" || eName == "A" || eName == "IMG" || eName == "B" || eName == "VIDEO" || e.target.isContentEditable) return;
		if (e.button == 2) {
			$("cmd_close").doCommand();
			$("contentAreaContextMenu").hidePopup();
			e.preventDefault();
		}
	}, false);
})();
