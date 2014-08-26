// ==UserScript==
// @name           OriginalBtnPlus.uc.js
// @homepageURL    https://github.com/Drager-oos/userChrome/blob/master/BtnPlus/OriginalBtnPlus.uc.js
// ==/UserScript==

(function() {
	$("TabsToolbar").appendChild($("alltabs-button", {
		tooltiptext: "左鍵：所有分頁選單",
		style: "padding: 0px;"
	}));

	$("urlbar").appendChild($("PanelUI-button", {
		tooltiptext: "左鍵：開啟選單\n中鍵：新建窗口並重載腳本\n右鍵：窗口占用屏幕右下半部分\n向上滾動：隱藏Firefox\n向下滾動：清除startupCache並重新啟動瀏覽器",
		onclick: "\
		if (event.button == 1) {userChromejs.rebuild();}\
		else if (event.button == 2) {\
			resizeTo(screen.availWidth / 2, screen.availHeight / 2, moveTo(screen.availWidth / 2, screen.availHeight / 2));\
			event.preventDefault();\
		}\
		",
		onDOMMouseScroll: "\
		if (event.detail > 0) {Services.appinfo.invalidateCachesOnRestart() || Application.restart();}\
		else {HideFirefox();}\
		return;\
		",
		onmouseover: "UCL.rebuild(); USL.rebuild(); ucjsMouseGestures.reload(true); addMenu.rebuild(true); uAutoPagerize.loadSetting(true); uAutoPagerize.loadSetting_CN(); KeyChanger.makeKeyset(true); Redirector.reload(); refererChanger.reload(true);",
		style: "margin: 0px -4px 0px -2px;"
	}));

	$("urlbar-icons").appendChild($("downloads-button" , {
		tooltiptext: "顯示下載進度\n\n左鍵：開啟選單\n中鍵：管理員\n右鍵：DownThemAll!...\n向上滾動：打開下載\n向下滾動：dTa 單鍵下載選擇器",
		onmouseover: "DownloadsIndicatorView.onCommand(event);",
		onclick: "if (event.button == 1) {MGs.dTaBtn('dta-manager-button');} else if (event.button) {MGs.dTaBtn('dta-button'); event.preventDefault();}",
		onDOMMouseScroll: "\
		if (event.detail > 0) {MGs.dTaBtn('dta-turboselect-button');}\
		else {gBrowser.selectedTab = gBrowser.addTab('about:downloads');}\
		document.getElementById('downloadsPanel').hidePopup();\
		return;\
		",
		style: "padding: 0px; margin-left: -1px;",
	}));

//	document.querySelector("#nav-bar").removeAttribute("overflowable");

	function DelayStart() {
		$("editBookmarkPanel", {position: "after_start"});

		$('AnotherBrowser').click();

		$("redirector-icon", {
			onmouseover: "document.getElementById('downloadsPanel').hidePopup();",
		});

//		$("urlbar-icons").appendChild($("clipple-statusbar-icon"));

		$("abp-menuitem", {class: "menu-iconic"});

		$("abp-toolbarbutton", {
			tooltiptext: "左鍵：Adblock Plus 選單\n中鍵：啟用 / 停用 Adblock Plus\n右鍵：Adblock Plus 條件偏好設定",
			onclick: "if (event.button == 2) {gBrowser.selectedTab = gBrowser.addTab('chrome://adblockplus/content/ui/filters.xul'); event.preventDefault();}"
		});

		$("abp-toolbar-popup", {onclick: "if (event.button == 2) {event.stopPropagation();}"});

		$("noscript-tbb", {
//			tooltiptext: "左鍵：NoScript 選單\n中鍵：暫時允許此頁面的所有物件\n右鍵：取消暫時許可",
			onclick: "if (event.button == 2) {noscriptOverlay.revokeTemp(); event.preventDefault();}"
		});

		$("urlbar-reload-button", {
			tooltiptext: "左鍵：重新載入此分頁\n滾動：重新載入所有分頁\n\n在復原分頁選單：\n右鍵：清除復原分頁列表",
			onDOMMouseScroll: "gBrowser.reloadAllTabs();",
			onmouseover: "document.getElementById('undoCloseTabPopup').openPopupAtScreen(event.screenX, event.screenY, true);",
		});

		$("urlbar-stop-button", {
			tooltiptext: "左鍵：停止載入此分頁\n滾動：停止載入所有分頁",
			onDOMMouseScroll: "Array.map(gBrowser.browsers, function(browser) {browser.stop()});",
		});

		var uCTPhideDelay, BFMhideDelay, uAPPhideDelay;

		$('urlbar-reload-button').addEventListener('mouseout', function() {
			uCTPhideDelay = setTimeout(function() {$('undoCloseTabPopup').hidePopup();}, 500);
		}, false);

		$('undoCloseTabPopup').addEventListener('mouseout', function() {
			uCTPhideDelay = setTimeout(function() {$('undoCloseTabPopup').hidePopup();}, 500);
		}, false);

		$('undoCloseTabPopup').addEventListener('mouseover', function() {
			if (uCTPhideDelay) {
				clearTimeout(uCTPhideDelay);
				uCTPhideDelay = null;
			}
		}, false);

		$("back-button", {
			onmouseover: "document.getElementById('backForwardMenu').openPopupAtScreen(event.screenX, event.screenY, true);",
		});

		$('back-button').addEventListener('mouseout', function() {
			BFMhideDelay = setTimeout(function() {$('backForwardMenu').hidePopup();}, 500);
		}, false);

		$('backForwardMenu').addEventListener('mouseout', function() {
			BFMhideDelay = setTimeout(function() {$('backForwardMenu').hidePopup();}, 500);
		}, false);

		$('backForwardMenu').addEventListener('mouseover', function() {
			if (BFMhideDelay) {
				clearTimeout(BFMhideDelay);
				BFMhideDelay = null;
			}
		}, false);

		$("uAutoPagerize-icon", {
			onmouseover: "document.getElementById('uAutoPagerize-popup').openPopup(document.getElementById('uAutoPagerize-icon'));",
		});

		$('uAutoPagerize-icon').addEventListener('mouseout', function() {
			uAPPhideDelay = setTimeout(function() {$('uAutoPagerize-popup').hidePopup();}, 500);
		}, false);

		$('uAutoPagerize-popup').addEventListener('mouseout', function() {
			uAPPhideDelay = setTimeout(function() {$('uAutoPagerize-popup').hidePopup();}, 500);
		}, false);

		$('uAutoPagerize-popup').addEventListener('mouseover', function() {
			if (uAPPhideDelay) {
				clearTimeout(uAPPhideDelay);
				uAPPhideDelay = null;
			}
		}, false);
	}

	function $(id, attr) {
		var el = document.getElementById(id);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	if (location == "chrome://browser/content/browser.xul") {setTimeout(DelayStart, 1000);}
})();
