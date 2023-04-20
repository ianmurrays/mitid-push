console.info('chrome-ext template-svelte-ts background script')

// Find if there's a notification token stored in the chrome extension storage
chrome.storage.local.get(['notificationToken'], (result) => {
  if (!result.notificationToken) {
    console.log('No token found, creating one');

    const notificationToken = crypto.randomUUID();

    chrome.storage.local.set({ notificationToken }, () => {
      console.log('Token created');
    });
  }
});

// Listen for the "waiting-for-approval" message from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'waiting-for-approval') {
    console.log('Received waiting-for-approval message');

    chrome.storage.local.get(['notificationToken'], async (result) => {
      if (result.notificationToken) {

        // POST to ntfy.sh
        await fetch(`https://ntfy.sh/${result.notificationToken}`, {
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
