console.log('Content script loaded');

// Use the mutation api to detect when an element of class .mitid-core-authenticator-header is added to the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // Check if the node contains an element with class .mitid-core-authenticator-header
      if (node.querySelector('#mitid-core-authenticator-header')) {
        console.log('Found element with id #mitid-core-authenticator-header');
        // Send a message to the background script
        chrome.runtime.sendMessage({ type: 'waiting-for-approval' });
      }
    });
  });
});

// Start observing the body element for mutations
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
