chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  if (message.type === 'saveUrl') {
      const url = message.url;

      chrome.storage.sync.get(['savedUrls'], function(result) {
          let urls = result.savedUrls || [];
          urls.unshift(url);

          if (urls.length > 10) {
              urls = urls.slice(0, 10);
          }

          chrome.storage.sync.set({ savedUrls: urls }, function() {
              console.log('URLs updated:', urls);
              sendResponse({ status: 'success', urls: urls });
          });
      });

      return true; // Keep the message channel open for async response
  } 
  else if (message.type === 'getUrls') {
      chrome.storage.sync.get(['savedUrls'], function(result) {
          sendResponse({ urls: result.savedUrls || [] });
      });

      return true; // Keep the message channel open for async response
  }
});
