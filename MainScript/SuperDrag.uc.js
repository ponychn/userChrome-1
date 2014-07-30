// ==UserScript==
// @name			SuperDrag.uc.js
// @homepageURL		http://www.cnblogs.com/ziyunfei/archive/2011/12/20/2293928.html
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function(event) {
	var self = arguments.callee;
	if (!event) {
		self.GESTURES = {
			image: {
				U: {
					name: "複製圖片網址",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("application/x-moz-file-promise-url"));
					}
				},
				UD: {
					name: "複製圖片",
					cmd: function(event, self) {
						(document.popupNode = content.document.createElement('img')).src = event.dataTransfer.getData("application/x-moz-file-promise-url");
						goDoCommand('cmd_copyImageContents');
					}
				},
				D: {
					name: "下載圖片(不彈窗)",
					cmd: function(event, self) {
						saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, true, null, document);
					}
				},
				L: {
					name: "檢視圖片(新分頁前景)",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
					}
				},
				R: {
					name: "Google 加密搜尋相似圖片",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab('https://encrypted.google.com/searchbyimage?image_url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
					}
				},
			},
			link: {
				U: {
					name: "複製鏈結網址",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
					}
				},
				UD: {
					name: "尋找 & 高亮關鍵字及複製鏈結文字",
					cmd: function(event, self) {
						var linkTXT = event.dataTransfer.getData("text/x-moz-url").split("\n")[1];
//						gFindBar.open();
						gFindBar.toggleHighlight(1);
						gFindBar.getElement('highlight').setAttribute("checked", "true");
//						gFindBar.getElement('highlight').setAttribute("checkState", "1");
						gFindBar._findField.value = linkTXT;
						gWHT.addWord(linkTXT);
						document.getElementById('searchbar').value = linkTXT;
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(linkTXT);
					}
				},
				D: {
					name: "下載鏈結(不彈窗)",
					cmd: function(event, self) {
						saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, true, null, document);
					}
				},
				DU: {
					name: "檢視當前鏈結網址的源代碼",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab('view-source:' + event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
					}
				},
				L: {
					name: "Google 翻譯鏈結文字 (中文)",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
						gTranslate.ZHTW(event);
					}
				},
				LR: {
					name: "Google 加密及百度圖片搜尋及複製鏈結文字",
					cmd: function(event, self) {
						var linkTXT = event.dataTransfer.getData("text/x-moz-url").split("\n")[1];
						gBrowser.selectedTab = gBrowser.addTab('https://duckduckgo.com/?q=!img ' + encodeURIComponent(linkTXT));
						gBrowser.addTab('http://image.baidu.com/i?&cl=2&ie=utf-8&oe=utf-8&word=' + encodeURIComponent(linkTXT));
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(linkTXT);
					}
				},
				LU: {
					name: "Google 翻譯及複製鏈結文字(新分頁前景)",
					cmd: function(event, self) {
						var linkTXT = event.dataTransfer.getData("text/x-moz-url").split("\n")[1];
						gBrowser.selectedTab = gBrowser.addTab('https://translate.google.com/#auto/zh-TW/' + encodeURIComponent(linkTXT));
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(linkTXT);
					}
				},
				LD: {
					name: "Google 翻譯鏈結文字 (英文)",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
						gTranslate.EN(event);
					}
				},
				R: {
					name: "Google 加密搜尋及複製鏈結文字(新分頁前景)",
					cmd: function(event, self) {
						var linkTXT = event.dataTransfer.getData("text/x-moz-url").split("\n")[1];
						gBrowser.selectedTab = gBrowser.addTab("https://encrypted.google.com/#q=" + encodeURIComponent(linkTXT));
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(linkTXT);
					}
				},
				RL: {
					name: "彈出搜索框(新分頁前景)",
					cmd: function(event, self) {
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
						document.getAnonymousElementByAttribute(document.querySelector('#searchbar').searchButton, 'anonid', 'searchbar-popup').openPopup(null, null, event.screenX, event.screenY);
					}
				},
				RU: {
					name: "Google 加密站內搜尋及複製鏈結文字(新分頁前景)",
					cmd: function(event, self) {
						gBrowser.selectedTab = gBrowser.addTab('https://encrypted.google.com/#q=site:' + content.location.host + ' ' + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
					}
				},
			},
			text: {
				U: {
					name: "複製為純文字 / HTML",
					cmd: function(event, self) {
						var div = content.document.createElement('div');
						div.appendChild(content.getSelection().getRangeAt(0).cloneContents());
						var focused = document.commandDispatcher.focusedElement;
						if (!focused) {var TXT = div.innerHTML;}
						else {var TXT = event.dataTransfer.getData("text/unicode");}
						Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(TXT);
						return;
					}
				},
				D: {
					name: "下載文字(不彈窗) / 貼上",
					cmd: function(event, self) {
						var focused = document.commandDispatcher.focusedElement;
						if (!focused) {saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(event.dataTransfer.getData("text/unicode")))), event.dataTransfer.getData("text/unicode").slice(0, 5) + ".txt", null, null, true, null, document);}
						else {goDoCommand("cmd_paste");}
						return;
					}
				},
				L: {
					name: "Google 翻譯選取文字 (中文)",
					cmd: function(event, self) {
						gTranslate.ZHTW(event);
					}
				},
				LR: {
					name: "Google 翻譯選取文字 (英文)",
					cmd: function(event, self) {
						gTranslate.EN(event);
					}
				},
				R: {
					name: "Google 加密搜尋選取文字[識別URL並打開](新分頁前景)",
					cmd: function(event, self) {
						var TXT = event.dataTransfer.getData("text/unicode");
						(/^\s*(?:(?:(?:ht|f)tps?:\/\/)?(?:(?:\w+?)(?:\.(?:[\w-]+?))*(?:\.(?:[a-zA-Z]{2,5}))|(?:(?:\d+)(?:\.\d+){3}))(?::\d{2,5})?(?:\/\S*|$)|data:(text|image)\/[\u0025-\u007a]+)\s*$/.test(TXT) && (gBrowser.selectedTab = gBrowser.addTab(TXT))) || (gBrowser.selectedTab = gBrowser.addTab("https://encrypted.google.com/#q=" + encodeURIComponent(TXT)));
					}
				},
				RL: {
					name: "彈出搜索框(新分頁前景)",
					cmd: function(event, self) {
						document.getAnonymousElementByAttribute(document.querySelector('#searchbar').searchButton, 'anonid', 'searchbar-popup').openPopup(null, null, event.screenX, event.screenY);
					}
				},
			},
		};
		["dragstart", "dragover", "drop"].forEach(function(type) {
			gBrowser.mPanelContainer.addEventListener(type, self, false);
		});
		window.addEventListener("unload", function() {
			["dragstart", "dragover", "drop"].forEach(function(type) {
				gBrowser.mPanelContainer.removeEventListener(type, self, false);
			});
		}, false);
		return;
	}
	switch (event.type) {
	case "dragstart":
		{
			self.lastPoint = [event.screenX, event.screenY];
			self.sourceNode = event.target;
			self.directionChain = "";
			event.target.localName == "img" && event.dataTransfer.setData("application/x-moz-file-promise-url", event.target.src);
			if (event.dataTransfer.types.contains("application/x-moz-file-promise-url")) {
				self.type = "image";
			} else if (event.dataTransfer.types.contains("text/x-moz-url")) {
				self.type = "link";
			} else {
				self.type = "text";
			}
			break;
		}
	case "dragover":
		{
			if (!self.lastPoint) return;
			Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService).getCurrentSession().canDrop = true;
			var [subX, subY] = [event.screenX - self.lastPoint[0], event.screenY - self.lastPoint[1]];
			var [distX, distY] = [(subX > 0 ? subX : (-subX)), (subY > 0 ? subY : (-subY))];
			var direction;
			if (distX < 10 && distY < 10) return;
			if (distX > distY) direction = subX < 0 ? "L" : "R";
			else direction = subY < 0 ? "U" : "D";
			if (direction != self.directionChain.charAt(self.directionChain.length - 1)) {
				self.directionChain += direction;
				XULBrowserWindow.statusTextField.label = self.GESTURES[self.type][self.directionChain] ? "手勢: " + self.directionChain + " " + self.GESTURES[self.type][self.directionChain].name : "未知手勢: " + self.directionChain;
				self.cmd = self.GESTURES[self.type][self.directionChain] ? self.GESTURES[self.type][self.directionChain].cmd : "";
			}
			self.lastPoint = [event.screenX, event.screenY];
			break;
		}
	case "drop":
		{
			if (self.lastPoint && event.target.localName != "textarea" && (!(event.target.localName == "input" && (event.target.type == "text" || event.target.type == "password"))) && event.target.contentEditable != "true") {
				event.preventDefault();
				event.stopPropagation();
				self.lastPoint = XULBrowserWindow.statusTextField.label = "";
				self.cmd && self.cmd(event, self);
			}
		}
	}
})()
