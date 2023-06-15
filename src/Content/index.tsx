chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.create({
    url:
      "http://www.google.com/search?q=" +
      encodeURIComponent(info.selectionText ?? ""),
  });
});

export default {};
