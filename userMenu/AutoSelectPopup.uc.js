(function() {
	var ASP = {
		init: function() {
			var popup = $("mainPopupSet").appendChild($C("menupopup", {
				id: "auto-popup",
				style: "-moz-appearance: none; background: -moz-linear-gradient(top, rgb(252, 252, 252) 0%, rgb(245, 245, 245) 33%, rgb(245, 245, 245) 100%); border: 2px solid rgb(144,144,144);"
			}));
			var menugroup = popup.appendChild($C("menugroup"));

			for (let i = 0, menu; menu = mMenus[i]; i++) {
				let menuItem = menugroup.appendChild($C("menuitem", {
					tooltiptext: menu.label,
					image: menu.image,
					class: "menuitem-iconic",
					command: menu.command,
					onclick: menu.onclick,
					style: menu.style || "max-width: 10px;"
				}));
			}
		}
	};
	var mMenus = [
		{
			label: '複製',
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABlSURBVDhP5Y5BCsAgEAP3i/1AP+D/zxUlwWBXXQueOhAQzQStcN3p2UmVFK80C7QGH1aEBniOBPqhgRnsQB8P8KzRe+i/+YHCO+htQNPjdaB/G4D6hoWekFzQohfUxngSg4pglgGUsQ0ZR4jGSwAAAABJRU5ErkJggg==",
			command: "cmd_copy",
		},
		{
			label: '剪下',
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVQ4jZ2RQYiNcRTFrzEzjSmaKOnzFl96Ne/1/3/nd1a2ErMapTQ1WZiSkmYja8ok4WUlCxsWNpKN2JiaFWKhXupZmWLDih2JiTybT6Fe88bZ3du5v3O7N2Id2Z6SdNr2pWazuW09/1+anp7eCnSAb0AnIkY2BLB9Evhq+4uko/+T/tB2H3grKW8IkHNu216tActFUUwO8m6KiLGyLCdSSuN1HbZngTXbfdtLv/t/zIyWZTkRVVUdrld9DiwDRyJixPZSnb4GzKeUyDnPSDoBXADu2r4XwDvghqQ54BrQzTm3gUd1+gvbZ4H3tr8DP+v+R+BUAJ8lLaSUtkuas70KnLG9YvsDcM7243qoX0N6wPGU0ngAN4Gu7WfAa+ANcN32CnAFOATcAi5LWrQ9W1XVnojYHBERjUZjS1VV+yQtAMckHZB00fYPoJNS2hURo/8ccbCKopi0fRv4VG/2QFJj6P9L2gk8tX0V2Au8AvYPDQB2A11gvtVq7QB6VVUdHBpgewq4b/uOpPPAy5xze2hARETOeQZ4AvQkLUbE2CDvL6RDiUelG+U+AAAAAElFTkSuQmCC",
			command: "cmd_cut",
		},
		{
			label: "貼上",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA40lEQVQ4je3TsUoDQRSF4a8IGMtUEmQFG59AsLQNmLewsfAZLC0tTKGRNKIPoKhgGknENhJIkyAsIqLkBSxstNiryLorlhYeOMVwZ/45d5hLsZZwg2esl+z5phoWMIcNpOihi/mo1VEpO3yCM2zjEK94wQhbOMAAjSJAggnauMUd7sMpxjjCEJtlgBRXkeIcF7iMFrqxnmIXy5jJAx7w9sVP6ESqdrSwjz1cx5v8COjnbwnN4hiL/4C/BqjhFI8Bmso+1a8BH5BENjgrsmlsYSfnVqRLCuCfqmIVTazl3IxaFd4Btt1bP1fAdN4AAAAASUVORK5CYII=",
			command: "cmd_paste",
		},
		{
			label: "刪除",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA80lEQVQ4jeXSoU5CYRjG8R+JZDIBYzMY2BydC1BmYl6DwQswQTUZoDLmRqOp0ZswGYQZ8BIYm4Vh0cCjIxwns/pu/33fnvM87znv9x2K6wILvIdFtJ2qhmcMcRqG0Wo/hfbRxTXGeMMEV2ESbRxPN5nvOscKHzuySgaUMcIyb5nmc2d4CbNo03iWyZShhL3M+YAqDlDJur2vxjNMprQ9Rh93OMx6lFm72W8/6xcd5AC3aOIVLdyEVrRmPIPfGswLGsz/WYM/HWIf9zZ3fok6zkI9WiWewmvs4QkdHKONk9CO1omnV9SggUesbf71ItbxNL5Cn4XJaL9nE0TVAAAAAElFTkSuQmCC",
			command: "cmd_delete",
		},
		{
			label: "高亮",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4jWNgGBTg6dOi/6RgrAb8/19PFB7EBlAUBoMDFD0t+k8qxjCgngQ4SA2gKAwGDAAAM3SE/usVkKQAAAAASUVORK5CYII=",
			onclick: "gWHT.addWord(getBrowserSelection());"
		},
		{
			label: "Google 加密搜尋",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWUlEQVQ4jaXTPUvDQBgH8HyzkiCVdlBcFD+CDgUn0bU5rUMRS6mD4BuCVgfFKmitCl0s+FKhvoEgVvsyWKuRS9JLcvm7tcplSHW44e6e5/c8x91JAaKFZJXWFELRzZBVWgsQLST9JfknInlt9ExRJLMMqSOG67ID7gLb5xbG100h1hNIFyzM51gbu61wnN7Znl14Al+GC7LTas9nMi20bPgHPnUXmatOxbE1E89v3D8wd8DAbGBiw0R/XMfupY3RJcM/oBCKkUUDiUMGF/h1HN+AQiiC0xSa4aL04mBgVvcPTKZNbBYspHIMy3mGJnXx+s4xmBARAVg4Ybh4ctAb66wNJXSUGxx7RfEqBaDa5EgdMSEwmWXIlnwA+Qcb5QbHcLLTbjBGcfboILLq4yX2xXVsFSzUP1zcVzmOb2zsF21EVsRkhVD89zPVJTmqhWWV1rsGVFqRo1r4G6iM33AbQTj+AAAAAElFTkSuQmCC",
			onclick: "gBrowser.selectedTab = gBrowser.addTab('https://encrypted.google.com/#q=' + encodeURIComponent(getBrowserSelection()));",
		},
		{
			label: "Google 加密站內搜尋",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADWklEQVQ4jYWOX0xbBRTGP7pgvQjigmFdoQPaLbL10tFebmuxra4FiQGU6CIvWxygYRmgCypsjMGstSvtFiKDRZisb3tgURfmeBA04pLBwME0je52Y21CtW7O4JZM55/k84EafPMkv+Tk5Hy/fAAAvSRla2WXTivLKVz/i16SsgEA6yUp29k5Hq44ejXq8V9VPO8tKh7fglLh/VqpPDKnVPZeVjxdM4q746Kyo31aeXr/lOLc91n0qaZwWC9J2RBEWVf81oJSEiTFwN80Bf6ipe9Pyn0PaAvcp9V3l9aeFVo6brOkLcEtr8VZdWiR/pFBRSvLOgiirCtqmVe2vfMHRe8DSv7faeu7z/LgPTqCv9IeWKHVe4eWriSL31jmc13znLs8wNnJZkUQU4LNjbPK1vbfaDpwj2VH7tLqX6E9tMLyY7/QHvqZtsAtbu9Nssa/yNmZIPnjPs5cqF8VaEVR19PkU6oOJSgeXKHsvUN78DYd/bfoOPETHSeStB5PcufQt7wy30cu7yXjuznzac1ag/M1LmWy8yhrfTFafEnaQwk6BhJ0nkywfOgHuk9Fefjzk0zebCZju8kbdZw550kJDLJubIf12vKLLk6+2ctq7zc0+W9SCt2g1B9jVVhh65dn2PhVN7un93L5uxfI75/kpbHt1wSDrAMg5I0UaiKL5kJGnU9w/OUGmlommda2wMLAHF+Z+pD10+10TjRSc6aO1WPPcGlWy9lTqggg5AEQ8gZzsyKX9I/zipjPqFzET57dSVv7WdaMv8/aL1ronGhg8UcvMX3UQxyTWDlSwqHBjREAq4LjWerIlCaTFwtyuLhZwwm3kXXDDTSf30XTuXrqz9bx0XAFMWAj3t1GdBTxkT36tQYBdXrkQmY6px57mKNGDUsOO6ga9TDjdAUzRt1c94GT6C8jfEbioIFo20TU5q4JvKq0yMfr0hjc8BALm/SETyQCpUTITARLCb9I9BYTnQaidRPxqpao/o+gG4j0ZKq44fkcojWf2F9AvK1fDRwwrO6vFxDN+cSejcQuDeHO+VeALBcwnJurisKivg6LegkWdQxlQhw2IQ6rEEeZEIdZiKFEvQSj+jq2qqMoyhgGkIXUrAdgAFAMwAjABKAUgDlFaepmTP0YUhn8AygAwFGBnA/BAAAAAElFTkSuQmCC",
			onclick: "gBrowser.selectedTab = gBrowser.addTab('https://encrypted.google.com/#q=' + content.location.host + ' ' + encodeURIComponent(getBrowserSelection()));",
		},
		{
			label: "百度搜尋",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWUlEQVQ4jaWSy0sCURjF/XfuRugukha1CzeBCBKIFFFIBEGrCoRwE4EErlskoYW0EFy0iBAkCMFNBCGuKrqjNg6OgzOTjY+5nhbh3ehMrw/O8vud73E8hDL8Rx5CGf5ajoBCsQuvT0IubwIATk51xA/bsPkPAdFtBYQyLIXeUCpbYtybQtcd0Na+LHb2WiCUYTXaRC5vCsBdyXIG3D/0QCjD2qaCl9cB9g9UPFb66OgcuzEVmayBpmKjVLamAxJJTTg9PQ+mHm1+sQ5CGS4ujUlAJmuAUIaZOQkdnaNS7SMYlhGKyKjVh7B6I2EQi6uTAJsDV9fvqFT7YNIQsws10eAPNNDWODa2FHh9Eoq3H85faKk2/IHGRGCWV2RYvZH7Fzo6n9o8VmS9CcPkzoBUWv82umfnhjNgfEg3pdK6M8AwuUihP9DA0bGGRFJDMCyLYLmu8NsSgP/oExgMERjFwInkAAAAAElFTkSuQmCC",
			onclick: "gBrowser.selectedTab = gBrowser.addTab('http://www.baidu.com/s?ie=utf-8&wd=' + encodeURIComponent(getBrowserSelection()));",
		},
	];
	ASP.init();
	function $(id) document.getElementById(id);
	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	location == "chrome://browser/content/browser.xul" && gBrowser.mPanelContainer.addEventListener("mouseup", function (event) {
		if (event.button == 0 && getBrowserSelection()) {
			document.getElementById("auto-popup").openPopup(null, null, event.screenX - 100, event.screenY + 20);
		}
	}, false);
})();
