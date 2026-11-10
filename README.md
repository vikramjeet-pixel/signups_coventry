# Star Super Market Coventry — Grand Opening Signup Page

## How to Connect the Form to Your Google Drive Sheet

1. **Create a Google Sheet in Your Drive**
   - Go to [Google Drive](https://drive.google.com) → **New** → **Google Sheets**.
   - Name it **`Star Super Market Coventry - Launch Signups`**.

2. **Add the Apps Script**
   - Inside your Google Sheet, click **Extensions** → **Apps Script** from the top menu.
   - Delete any default code in `Code.gs` and paste the entire contents of [`google-apps-script.js`](./google-apps-script.js).
   - Click the **Save** icon (`Ctrl + S`).

3. **Deploy as a Web App**
   - Click **Deploy** (top-right blue button) → **New deployment**.
   - Click the gear icon next to **Select type** → choose **Web app**.
   - Set **Execute as**: `Me`
   - Set **Who has access**: `Anyone` *(required so visitors on your website can submit the form)*
   - Click **Deploy**, authorize permissions when prompted, and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

4. **Paste Your Web App URL into `script.js`**
   - Open [`script.js`](./script.js) and paste your copied URL on line 9:
     ```js
     const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
     ```
   - Every form submission will now automatically create a row in your Google Drive Sheet with:
     `Timestamp (UK) | Guest Pass No. | Full Name | Email Address | Mobile Number | Postcode | Launch Updates Opt-In`
