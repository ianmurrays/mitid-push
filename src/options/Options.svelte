<script lang="ts">
  let notificationToken: string;
  let endpoint: string;
  let promise = fetchData();
  let showSavedMessage = false;

  async function fetchData(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['notificationToken', 'endpoint'], (result) => {
        notificationToken = result.notificationToken;
        endpoint = result.endpoint;

        resolve();
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

    notificationToken = crypto.randomUUID();

    chrome.storage.local.set({ notificationToken }, () => {});
  }

  function testNotification() {
    chrome.runtime.sendMessage({ type: 'waiting-for-approval' });
  }

  let timer: number;
  let savedMessageTimer: number;

  const debounceSave = () => {
    showSavedMessage = false;

    clearTimeout(timer);
    clearTimeout(savedMessageTimer);

    timer = setTimeout(() => {
      chrome.storage.local.set({ endpoint }, () => {
        showSavedMessage = true;
        savedMessageTimer = setTimeout(() => {
          showSavedMessage = false;
        }, 2000);
      });
    }, 500);
  }
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</svelte:head>

<main>
  <div class="container mt-5">
    <div class="row mb-5">
      <div class="col-12 text-center">
        <img src="img/logo.png" alt="MitID Logo" height="128" />
        <h3 class="mt-2">MitID Push</h3>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        {#await promise}
          <p>Loading...</p>
        {:then}
          <div class="mb-3 d-flex">
            <div class="flex-grow-1 form-floating">
              <input type="text" readonly value={notificationToken} on:click={selectAll} id="notificationToken" class="form-control" />
              <label for="notificationToken" class="form-label">Notification Token</label>
            </div>

            <div class="ps-1">
              <button on:click={regenerateToken} class="btn btn-primary" style="height: 100%">Regenerate</button>
              <button on:click={testNotification} class="btn btn-primary" style="height: 100%">Test</button>
            </div>
          </div>

          <div class="mb-3 form-floating">
            <input type="text" bind:value={endpoint} id="endpoint" required class="form-control" on:keyup={debounceSave} />
            <label for="endpoint" class="form-label">Endpoint</label>

            {#if showSavedMessage}
              <div class="form-text text-success">Saved!</div>
            {:else}
              <div class="form-text">You can here set a custom ntfy server in case you're using a different one.</div>
            {/if}
          </div>
        {/await}
      </div>

      <div class="col-4">
        <p>
          <strong>Instructions:</strong>
          Download the <a href="https://ntfy.sh" target="_blank" rel="noopener">ntfy</a> app on your phone, then add a new subscription using the token above as the topic name.
        </p>
      </div>
    </div>
  </div>

</main>
