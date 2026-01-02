# Feedback Auto-Filler

A professional Chrome extension that automatically fills feedback and evaluation forms with your selected options, saving you time on surveys and course evaluations.

## Features

-  **Instant Auto-Fill**: Fill all form questions with a single click
-  **Custom Choice Selection**: Choose your preferred answer (A, B, C, or D)
-  **Comment Auto-Fill**: Optionally fill comment fields with "N/A"
-  **Remember Preferences**: Saves your last selected options
-  **Visual Feedback**: Highlights filled fields for easy verification
-  **Cross-Browser**: Works on Chrome, Edge, and other Chromium-based browsers

## Installation

### From Chrome Web Store (Recommended)
*Coming soon - Extension pending review*

### Manual Installation (For Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `Feedback_AutoFiller_Extension` folder
6. The extension icon will appear in your browser toolbar

## Usage

1. Navigate to your feedback or evaluation form
2. Click the **Feedback Auto-Filler** extension icon in your browser toolbar
3. Select your preferred answer choice (A, B, C, or D)
4. *(Optional)* Check "Auto-fill comments with N/A" if the form has comment fields
5. Click **Fill Form**
6. The extension will automatically fill all questions with your selected option
7. Review the filled form and submit when ready

## Privacy

This extension:
-  Does **NOT** collect any personal data
-  Does **NOT** send any information to external servers
-  Only stores your preference settings locally in your browser
-  Only activates when you click the "Fill Form" button

## Browser Compatibility

-  Google Chrome
-  Microsoft Edge
-  Brave Browser
-  Any Chromium-based browser

## Development

### Project Structure
```
Feedback_AutoFiller_Extension/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Extension popup interface
│   ├── popup.css          # Popup styling
│   └── popup.js           # Popup logic
├── content/
│   └── content.js         # Form detection and filling logic
├── icons/
│   ├── icon-16.png        # 16x16 icon
│   ├── icon-48.png        # 48x48 icon
│   └── icon-128.png       # 128x128 icon
└── README.md              # This file
```

### Technologies Used
- Manifest V3 (Chrome Extension API)
- Vanilla JavaScript (no dependencies)
- HTML5 & CSS3

## Support

If you encounter any issues or have suggestions:
1. Check that you're on a page with a feedback/evaluation form
2. Ensure the form has radio buttons or select elements with options A-D
3. Try refreshing the page and running the extension again

## License

MIT License - Feel free to use and modify as needed

## Contributing

Contributions welcome! Feel free to submit issues or pull requests.

---

**Note**: This extension is designed to work with feedback forms, evaluation surveys, and course questionnaires. It detects radio button groups and select elements with A-D options, making it versatile for various form formats. I do NOT recommend using it if it may negatively impact your academic performance or if it may be against the terms of service of the institution you are using it on.
