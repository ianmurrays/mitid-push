<script lang="ts">
  async function getToken(): Promise<string> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['notificationToken'], (result) => {
        resolve(result.notificationToken);
      });
    });
  }

  function selectAll(event: MouseEvent) {
    (event.target as HTMLInputElement).select();
  }

  function regenerateToken() {
    if (!confirm('Are you sure you want to regenerate your token?')) {
      return;
    }

    const notificationToken = crypto.randomUUID();

    chrome.storage.local.set({ notificationToken }, () => {
      notificationTokenPromise = Promise.resolve(notificationToken);
    });
  }

  function testNotification() {
    chrome.runtime.sendMessage({ type: 'waiting-for-approval' });
  }

  let notificationTokenPromise: Promise<string> = getToken();
</script>

<main>
  <h3>MitID Push</h3>

  {#await notificationTokenPromise}
    <input type="text" readonly value="Loading..." />
  {:then notificationToken}
    <input type="text" readonly value={notificationToken} on:click={selectAll} />
    <button on:click={regenerateToken}>Regenerate</button>
    <button on:click={testNotification}>Test</button>

    <p>
      In your <a href="https://ntfy.sh" target="_blank" rel="noopener">ntfy</a> app, add a new subscription using the token above as the topic name.
    </p>
  {/await}

</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h3 {
    color: #0060e6;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.2rem;
    margin: 2rem auto;
  }

  input {
    width: 100%;
    max-width: 20rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    margin: 0 auto;
    text-align: center;
  }

  button {
    /* display: block; */
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: #fff;
    background-color: #0060e6;
    cursor: pointer;
  }
</style>
