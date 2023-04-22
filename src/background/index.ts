console.info('chrome-ext template-svelte-ts background script')

// Find if there's a notification token stored in the chrome extension storage
// Also, set the endpoint to a default value if it's not already set
chrome.storage.local.get(['notificationToken', 'endpoint'], (result) => {
  if (!result.notificationToken) {
    console.log('No token found, creating one');

    const notificationToken = crypto.randomUUID();

    chrome.storage.local.set({ notificationToken }, () => {
      console.log('Token created');
    });
  }

  if (!result.endpoint) {
    console.log('No endpoint found, setting default');

    chrome.storage.local.set({ endpoint: 'https://ntfy.sh' }, () => {
      console.log('Endpoint set to default');
    });
  }
});

// Listen for the "waiting-for-approval" message from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'waiting-for-approval') {
    console.log('Received waiting-for-approval message');

    chrome.storage.local.get(['notificationToken', 'endpoint'], async ({ notificationToken, endpoint }) => {
      if (notificationToken && endpoint) {

        // POST to ntfy.sh
        await fetch(`${endpoint}/${notificationToken}`, {
          method: 'POST',
          headers: {
            'Title': 'MitID Push',
            'Priority': 'high',
            'Click': 'mitid-app://'
          },
          body: 'Tap to open MitID'
        })
      }
    });
  }
});

export {}
