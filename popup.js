document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const checkButton = document.getElementById('checkButton');
    const message = document.getElementById('message');

    if (!saveButton || !checkButton || !message) {
        console.error('One or more elements not found in the popup HTML.');
        return;
    }

    // Function to display the stored URLs as clickable links
    function displayStoredUrls(urls) {
        if (urls && urls.length > 0) {
            const urlLinks = urls.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>');
            message.innerHTML = 'Stored URLs:<br>' + urlLinks;
        } else {
            message.textContent = 'No URLs are currently stored!';
        }
    }

    // Function to request stored URLs from the background script
    function fetchStoredUrls() {
        chrome.runtime.sendMessage({ type: 'getUrls' }, function(response) {
            if (response && response.urls) {
                displayStoredUrls(response.urls);
            } else {
                message.textContent = 'Failed to retrieve URLs!';
            }
        });
    }

    // Add click event listener to the save button
    saveButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const url = currentTab.url;

            chrome.runtime.sendMessage({ type: 'saveUrl', url: url }, function (response) {
                if (response && response.status === 'success') {
                    displayStoredUrls(response.urls);
                } else {
                    message.textContent = 'Failed to save URL!';
                }
            });
        });
    });

    // Add click event listener to the check button
    checkButton.addEventListener('click', function () {
        fetchStoredUrls();
    });

    // Initial fetch to display stored URLs on popup open
    fetchStoredUrls();
});
