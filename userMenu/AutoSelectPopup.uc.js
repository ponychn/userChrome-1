// ==UserScript==
// @name           AutoSelectPopup.uc.js
// @note           22.03.2015 - 新增自動複製及統計選取字數
// @note           20.09.2014 - 新增雙擊頁面觸發彈出，及添加 state 區分按鈕出現條件和在部分網頁不觸發
// @note           17.09.2014 - 新增搜索菜單按鈕
// @note           12.09.2014 - 新增翻譯功能 (P.S. 翻譯字數約 200 字)
// @note           07.09.2014 - 修改為配置外置版
// @note           31.07.2014 - 新增按住 C / Ctrl + C 便複製，按住 V / Ctrl + V 便貼上，及按住 F / Ctrl + F 便尋找
// @note           29.07.2014 - 新增限制條件，分別為於輸入框內或當按住 Ctrl/Shift/Alt 時
// @note           28.07.2014 - 選取文字後自動彈出自定選單
// @homepageURL    https://github.com/Drager-oos/userChrome/blob/master/userMenu/AutoSelectPopup.uc.js
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function() {
	ASP = {
		get FILE() {
			let aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath("local\\_AutoSelectPopup.js");
			delete this.FILE;
			return this.FILE = aFile;
		},
		configs: {},
		init: function() {
			var ASPopup = $("mainPopupSet").appendChild($C("menupopup", {
				id: "AutoSelect-popup",
				style: "-moz-appearance: none; background: -moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%); border: 2px solid rgb(144,144,144); border-radius: 5px;",
				onpopupshown: "\
				var select = getBrowserSelection();\
				if (select) {\
					goDoCommand('cmd_copy');\
					XULBrowserWindow.statusTextField.label = '已複製：「' + readFromClipboard() + '」';\
				}"
			}));
			var ASPMG = ASPopup.appendChild($C("menugroup", {
				id: "AutoSelect-menugroup",
				onclick: "document.getElementById('AutoSelect-popup').hidePopup();"
			}));
			var ctrlCitem = ASPopup.appendChild($C("menuitem", {
				accesskey: "C",
				command: "cmd_copy",
				style: "-moz-appearance: none;"
			}));
			var ctrlVitem = ASPopup.appendChild($C("menuitem", {
				accesskey: "V",
				command: "cmd_paste",
				style: "-moz-appearance: none;"
			}));
			var ctrlFitem = ASPopup.appendChild($C("menuitem", {
				accesskey: "F",
				command: "cmd_find",
				style: "-moz-appearance: none;"
			}));
			var menuitem = $('devToolsSeparator').parentNode.insertBefore($C('menuitem', {
				id: 'ASP-menuitem',
				label: 'AutoSelectPopup',
				tooltiptext: '左鍵：重載配置\n右鍵：編輯配置',
				oncommand: 'setTimeout(function() {ASP.rebuild(true);}, 10);',
				onclick: 'if (event.button == 2) {event.preventDefault(); ASP.edit(ASP.FILE);}'
			}), $('devToolsSeparator'));

			setTimeout(function() {ASP.rebuild();}, 1000);
			ASP.startup();
			ASPopup.addEventListener("popuphidden", function() {
				var select = getBrowserSelection();
				if (select) {
					goDoCommand("cmd_copy");
					XULBrowserWindow.statusTextField.label = '已複製：「' + readFromClipboard() + '」';
				}
			}, false);
		},
		rebuild: function(isAlert) {
			var aFile = this.FILE;
			if (!aFile || !aFile.exists() || !aFile.isFile()) {
				this.log(aFile? aFile.path : "配置文件");
				return;
			}

			var data = this.loadText(aFile);
			var sandbox = new Cu.Sandbox( new XPCNativeWrapper(window) );
			sandbox.Components = Components;
			sandbox.Cc = Cc;
			sandbox.Ci = Ci;
			sandbox.Cr = Cr;
			sandbox.Cu = Cu;
			sandbox.Services = Services;
			sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");

			try {
				Cu.evalInSandbox(data, sandbox, "1.8");
			} catch (e) {
				this.alert("Error: " + e + "\n請重新檢查配置文件.");
				return this.log(e);
			}

			if (sandbox.configs) {
				this.configs = sandbox.configs;
			} else {
				this.alert('配置文件中 configs 不存在');
				return;
			}

			this.loadSubMenu();

			if (isAlert) this.alert("配置已經重新載入");
		},
		loadSubMenu: function() {
			var ASPMG = $("AutoSelect-menugroup");

			// 重載時防止重複項目
			for (var i = ASPMG.childNodes.length - 1; i >= 0; i--) {
				ASPMG.removeChild(ASPMG.childNodes[i]);
			}

			for (var i = 0; i < this.configs.buttons.length; i++) {
				var btn = this.configs.buttons[i];
				let btnItems = ASPMG.appendChild($C('toolbarbutton', {
					tooltiptext: btn.label,
					image: btn.image,
					state: btn.state
				}));
				if (typeof btn.onclick == 'function') {
					btnItems.setAttribute('onclick', btn.onclick.toSource() + '.call(this, event);');
				} else {
					btnItems.setAttribute('onclick', btn.onclick);
				}
				if (typeof btn.onDOMMouseScroll == 'function') {
					btnItems.setAttribute('onDOMMouseScroll', btn.onDOMMouseScroll.toSource() + '.call(this, event);');
				} else {
					btnItems.setAttribute('onDOMMouseScroll', btn.onDOMMouseScroll);
				}
			}

			var SearchBtn = ASPMG.appendChild($C("toolbarbutton", {
				id: "SearchMenu-button",
				type: "menu",
				tooltiptext: "左鍵：Google 加密\n中鍵：百度貼吧\n右鍵：Google 加密站內\n向上滾動：百度圖片\n向下滾動：Google 圖片\n\n❖ 若搜索欄有文字，便搜尋搜索欄文字\n❖ 若搜索欄沒有文字並選取了文字，便搜尋選取文字\n❖ 否則便搜尋剪貼簿中的文字\n❖ 新分頁前景",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACo0lEQVQ4jY3Mz2vTcBgG8FdnallK3VKW/mAuLLD1B8OlI23arW22NGWHUNMcwkAHybZT0a21uq60PWQDxzwNetCL9KJ40FvBg55E/wTR01BBEMSDB0Xc6vZ6Sike5r7wuTzf530AAMCyrPP1ev2apmlPFUV5eRpN0540m80CAJwD+9g0zcfhcBhDoRCGw+FThUIhjEQiaJpmCwAAGo2GHgwGcWJiomdqaupYFMWPkiS9TSaTP/r/bJFIBGu1mgT5fP4Ry7Jok2X51dbW1rSu6wOtVuuiZVkuwzBucRz3q7/HsiwqirIPkiR1GIZBhmFwfn7+tWVZg2tra9VMJvNZEISfuVzuRbPZDBaLxcLk5OSx3WUYBmVZboMoip1AIIDj4+Mn1WqVX11dvT06OoqBQKAnHo9/2tvbuyRJ0vP+fGFhoQ2pVKrj9XpxZmbmi67rA/F4/MDr9WI/mqZxeXn5uq7rN2ma7uXpdLoNyblkh6Io5DjuQNf1gWg0+o2iKPyXqqo3TNM0+7NUKtWGRCLRcbvdyLLs793dXU86nX7mdruxn9/v725sbEwtLi7u9+eJRKINsVisQ5IkkiSJ+Xx+u9FoXOY47p3L5UKSJNHn8x0pinIHAM4LgvDe7pIkiYIgtIHn+Y7T6USn04kjIyNHhmGsWJY1aBjGVVVVV0qlUtCyrAsAAOvr69Msy361+70Bh8OBNpIkT3ief6Oqam1paakoy/IDnuc/lMvlJABAuVzm/H7/ocPhwFgs1oZMJvOQIAj8n7Gxse+bm5tzOzs7MZ/Pd0gQBIqieA8qlUrW5XKdnGXE4/F0aZruEgSBw8PDfyqVShQAADRN2x4aGjo+ywhBEEhRVLdQKJSg/9VqtVg2m707Ozt7/zS5XG67Xq9fse/+AnDURgQylYErAAAAAElFTkSuQmCC",
				style: "padding: 0px;",
				onclick: "\
				var txt = document.getElementById('searchbar').value || getBrowserSelection() || readFromClipboard();\
				var url = ['https://encrypted.google.com/#q=', 'http://tieba.baidu.com/f?ie=utf-8&kw=', 'https://encrypted.google.com/#q=site:' + content.location.host + ' '];\
				gBrowser.selectedTab = gBrowser.addTab(url[event.button] + encodeURIComponent(txt));\
				",
				onDOMMouseScroll: "\
				var txt = document.getElementById('searchbar').value || getBrowserSelection() || readFromClipboard();\
				if (event.detail > 0) {var url = 'https://duckduckgo.com/?q=!img ';}\
				else {var url = 'http://image.baidu.com/i?&cl=2&ie=utf-8&oe=utf-8&word=';}\
				gBrowser.selectedTab = gBrowser.addTab(url + encodeURIComponent(txt));\
				document.getElementById('AutoSelect-popup').hidePopup();\
				return;\
				",
			}));
			var SearchPopup = SearchBtn.appendChild($C("menupopup", {
				style: "-moz-appearance: none; background: -moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%); border: 2px solid rgb(144,144,144); border-radius: 5px;"
			}));

			for (var i = 0; i < this.configs.menuitems.length; i++) {
				var mi = this.configs.menuitems[i];
				let miItems = SearchPopup.appendChild($C('menuitem', {
					label: mi.label,
					tooltiptext: "左鍵：新分頁前景\n中鍵：此分頁\n右鍵：新分頁背景\n\n❖ 若搜索欄有文字，便搜尋搜索欄文字\n❖ 若搜索欄沒有文字並選取了文字，便搜尋選取文字\n❖ 否則便搜尋剪貼簿中的文字",
					image: mi.image,
					class: "menuitem-iconic",
					url: mi.url,
					onclick: "SwitchSearch.onClick(event); event.preventDefault(); event.stopPropagation();"
				}));
			}
		},
		edit: function(aFile) {
			if (!aFile || !aFile.exists() || !aFile.isFile()) return;
			var editor;
			try {
				editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
			} catch(e) {}
			
			if (!editor || !editor.exists()) {
				alert("編輯器的路徑未設置!!!\n請設置 view_source.editor.path");
				toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
				return;
			}

			var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0? "gbk": "UTF-8";
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);

			try {
				var path = UI.ConvertFromUnicode(aFile.path);
				var args = [path];
				process.init(editor);
				process.run(false, args, args.length);
			} catch (e) {
				alert("編輯器路徑不正確");
			}
		},
		loadText: function(aFile) {
			var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
			var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
			fstream.init(aFile, -1, 0, 0);
			sstream.init(fstream);

			var data = sstream.read(sstream.available());
			try { data = decodeURIComponent(escape(data)); } catch(e) {}
			sstream.close();
			fstream.close();
			return data;
		},
		alert: function(aString, aTitle) {
			Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService)
				.showAlertNotification("", aTitle||"AutoSelectPopup" , aString, false, "", null);
		},
		log: function() {
			Application.console.log(Array.slice(arguments));
		},
		startup: function() {
			gBrowser.mPanelContainer.addEventListener("mouseup", function(e) {
				var eName = e.target.nodeName || e.target.localName || e.target.tagName;
				if (eName == "TEXTAREA" || eName == "INPUT" || e.target.isContentEditable) return;
				if (/^about:(blank|newtab|addons|config)/i.test(content.location.toString())) return;
				if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
				if (e.button == 0 && getBrowserSelection()) {
					$("AutoSelect-popup").openPopupAtScreen(e.screenX - 60, e.screenY - 40, true);
					var HideCSS = '\
						#AutoSelect-menugroup toolbarbutton[state="dblclick"] {display:none!important;}\
						#AutoSelect-menugroup toolbarbutton[state="select"] {display:block!important;}\
					'.replace(/[\r\n\t]/g, '');;
					ASP.style = addStyle(HideCSS);
				}
			}, false);
			gBrowser.mPanelContainer.addEventListener("dblclick", function(e) {
				if (/^about:(blank|newtab|addons|config)|chrome:\/\/*/i.test(content.location.toString())) return;
				if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
				if (e.button == 0) {
					$("AutoSelect-popup").openPopupAtScreen(e.screenX, e.screenY, true);
					content.document.getSelection().removeAllRanges();
				}
				var HideCSS = '\
					#AutoSelect-menugroup toolbarbutton[state="dblclick"] {display:block!important;}\
					#AutoSelect-menugroup toolbarbutton[state="select"] {display:none!important;}\
				'.replace(/[\r\n\t]/g, '');;
				ASP.style = addStyle(HideCSS);
			}, false);
			gBrowser.mPanelContainer.addEventListener("mousemove", function(e) {
				if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
				if (e.button == 0 && getBrowserSelection()) {
					function countNonAlphabet(str) {
						var m = str.match(/[^\x00-\x80]/g);
						return (!m?0:m.length);
					}
					function countAlphabetWord(str) {
						var m = str.match(/\b[\w-]+\b/g);
						return (!m?0:m.length);
					}
					function countNonSpaceChar(str) {
						var m = str.match(/\S/g);
						return (!m?0:m.length);
					}

					var string = content.getSelection().toString();
					var nonAlphabetNum = countNonAlphabet(string);
					var alphabetWordNum = countAlphabetWord(string);
					var wordNum = nonAlphabetNum + alphabetWordNum;
					var nonSpaceCharNum = countNonSpaceChar(string);
					XULBrowserWindow.statusTextField.label = '英文字數：' + wordNum + ' | 中文字數：' + nonSpaceCharNum;
				}
			}, false);
		}
	};
	var css = '\
		#SearchMenu-button dropmarker,\
		#AutoSelect-popup autorepeatbutton {display:none!important;}\
		#SearchMenu-button .toolbarbutton-icon {margin:0px 3px;}\
		#AutoSelect-popup {opacity:0.2!important; -moz-transition:opacity 0.3s ease-out!important;}\
		#AutoSelect-popup:hover {opacity:1!important; -moz-transition:opacity 0.2s ease-in!important;}\
		'.replace(/[\r\n\t]/g, '');;
	ASP.style = addStyle(css);
	ASP.init();
	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}
})();
