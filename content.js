document.querySelectorAll("a").forEach(link => {
    const url = link.href;
    chrome.runtime.sendMessage({ url: url });
});
