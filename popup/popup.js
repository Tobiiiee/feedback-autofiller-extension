// Get DOM elements
const fillButton = document.getElementById('fillButton');
const messageDiv = document.getElementById('message');
const fillCommentsCheckbox = document.getElementById('fillComments');

// Load saved preferences
chrome.storage.sync.get(['selectedChoice', 'fillComments'], (result) => {
    if (result.selectedChoice) {
        const radio = document.querySelector(`input[name="choice"][value="${result.selectedChoice}"]`);
        if (radio) radio.checked = true;
    }
    if (result.fillComments !== undefined) {
        fillCommentsCheckbox.checked = result.fillComments;
    }
});

// Save preferences when changed
document.querySelectorAll('input[name="choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
        chrome.storage.sync.set({ selectedChoice: radio.value });
    });
});

fillCommentsCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ fillComments: fillCommentsCheckbox.checked });
});

// Handle fill button click
fillButton.addEventListener('click', async () => {
    const selectedChoice = document.querySelector('input[name="choice"]:checked').value;
    const shouldFillComments = fillCommentsCheckbox.checked;

    try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Send message to content script
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'fillForm',
            choice: selectedChoice,
            fillComments: shouldFillComments
        });

        // Show success message
        if (response && response.success) {
            showMessage(`Form filled successfully! ${response.count} question(s) auto-filled.`, 'success');
        } else {
            showMessage(response?.message || 'No form found on this page.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error: Make sure you\'re on a Feedback form page.', 'error');
    }
});

// Show message function
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}
