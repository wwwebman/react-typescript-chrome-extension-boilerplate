chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("onUpdated addListener:", tabId, changeInfo, tab);
});

chrome.tabs.onActivated.addListener((storage) => {
  console.log("onActivated addListener:", storage);
});

chrome.storage.onChanged.addListener((storage) => {
  console.log("onChanged addListener:", storage);
});

export default {};
