// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillForm') {
        const result = fillFeedbackForm(request.choice, request.fillComments);
        sendResponse(result);
    }
    return true; // Keep message channel open for async response
});

/**
 * Main function to fill feedback form
 * @param {string} choice - The selected choice (A, B, C, or D)
 * @param {boolean} fillComments - Whether to fill comment fields
 * @returns {object} Result object with success status and count
 */
function fillFeedbackForm(choice, fillComments) {
    let filledCount = 0;

    // Strategy 1: Find radio button groups (common in feedback forms)
    const radioGroups = findRadioButtonGroups();

    radioGroups.forEach(group => {
        const radioToSelect = Array.from(group.radios).find(radio => {
            // Check if the value or label matches the choice
            const value = radio.value.toUpperCase();
            const label = radio.nextElementSibling?.textContent?.trim().toUpperCase() || '';

            return value === choice ||
                value.startsWith(choice) ||
                label.startsWith(choice);
        });

        if (radioToSelect && !radioToSelect.checked) {
            radioToSelect.checked = true;
            radioToSelect.dispatchEvent(new Event('change', { bubbles: true }));
            radioToSelect.dispatchEvent(new Event('click', { bubbles: true }));
            filledCount++;

            // Visual feedback
            highlightElement(radioToSelect.parentElement);
        }
    });

    // Strategy 2: Find select dropdowns
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        // Skip if it's not a question dropdown (e.g., course selection)
        if (select.id.includes('course') || select.id.includes('subject')) {
            return;
        }

        const options = Array.from(select.options);
        const optionToSelect = options.find(option => {
            const value = option.value.toUpperCase();
            const text = option.textContent.toUpperCase();
            return value === choice ||
                value.startsWith(choice) ||
                text.startsWith(choice);
        });

        if (optionToSelect && select.value !== optionToSelect.value) {
            select.value = optionToSelect.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
            highlightElement(select);
        }
    });

    // Strategy 3: Fill comment fields if requested
    if (fillComments) {
        const commentFields = findCommentFields();
        commentFields.forEach(field => {
            if (!field.value || field.value.trim() === '') {
                field.value = 'N/A';
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
                highlightElement(field);
            }
        });
    }

    if (filledCount === 0) {
        return {
            success: false,
            count: 0,
            message: 'No fillable form elements found on this page.'
        };
    }

    return {
        success: true,
        count: filledCount
    };
}

/**
 * Find all radio button groups on the page
 * @returns {Array} Array of objects containing radio button groups
 */
function findRadioButtonGroups() {
    const groups = new Map();
    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        const name = radio.name;
        if (!name) return;

        // Skip the default "Select" option
        if (radio.value === '' || radio.value.toLowerCase() === 'select') {
            return;
        }

        if (!groups.has(name)) {
            groups.set(name, {
                name: name,
                radios: []
            });
        }
        groups.get(name).radios.push(radio);
    });

    // Filter out groups that don't have A, B, C, D options
    return Array.from(groups.values()).filter(group => {
        const values = group.radios.map(r => r.value.toUpperCase());
        return values.some(v => ['A', 'B', 'C', 'D'].includes(v) || v.match(/^[A-D]/));
    });
}

/**
 * Find comment/textarea fields on the page
 * @returns {Array} Array of textarea and input elements
 */
function findCommentFields() {
    const fields = [];

    // Find textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // Look for comment-related keywords in id, name, or nearby labels
        const id = (textarea.id || '').toLowerCase();
        const name = (textarea.name || '').toLowerCase();
        const placeholder = (textarea.placeholder || '').toLowerCase();

        if (id.includes('comment') ||
            name.includes('comment') ||
            placeholder.includes('comment') ||
            id.includes('remark') ||
            name.includes('remark') ||
            id.includes('feedback') ||
            name.includes('feedback')) {
            fields.push(textarea);
        }
    });

    // Find text inputs that might be for comments
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        const id = (input.id || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();

        if (id.includes('comment') ||
            name.includes('comment') ||
            placeholder.includes('comment') ||
            id.includes('remark') ||
            name.includes('remark')) {
            fields.push(input);
        }
    });

    return fields;
}

/**
 * Highlight an element briefly to show it was filled
 * @param {HTMLElement} element - The element to highlight
 */
function highlightElement(element) {
    const originalBg = element.style.backgroundColor;
    const originalTransition = element.style.transition;

    element.style.transition = 'background-color 0.3s ease';
    element.style.backgroundColor = '#d4edda';

    setTimeout(() => {
        element.style.backgroundColor = originalBg;
        setTimeout(() => {
            element.style.transition = originalTransition;
        }, 300);
    }, 600);
}
