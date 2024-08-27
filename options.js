document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clearButton');
    const status = document.getElementById('status');
    const savedUrlsList = document.getElementById('savedUrlsList');

    // Clear all URLs
    clearButton.addEventListener('click', () => {
        chrome.storage.sync.clear(() => {
            status.textContent = 'All URLs cleared.';
            savedUrlsList.innerHTML = '';  // Clear the list display as well
        });
    });

    // Display saved URLs
    function displaySavedUrls() {
        chrome.storage.sync.get({ urls: [] }, (data) => {
            savedUrlsList.innerHTML = '';  // Clear the list before displaying

            data.urls.forEach((url, index) => {
                let li = document.createElement('li');
                li.textContent = url;

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    removeUrl(index);
                });

                li.appendChild(deleteButton);
                savedUrlsList.appendChild(li);
            });

            if (data.urls.length === 0) {
                status.textContent = 'No saved URLs.';
            }
        });
    }

    // Remove a URL by index
    function removeUrl(index) {
        chrome.storage.sync.get({ urls: [] }, (data) => {
            let urls = data.urls;
            urls.splice(index, 1);

            chrome.storage.sync.set({ urls: urls }, () => {
                displaySavedUrls();  // Refresh the list after deletion
            });
        });
    }

    displaySavedUrls();  // Load saved URLs on page load
});
