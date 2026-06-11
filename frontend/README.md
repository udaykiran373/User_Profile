# User Profile Frontend

A simple React + Vite app for creating and viewing user profiles.

## What it does

- shows a list of saved user profiles
- allows uploading a profile photo
- sends form data to the backend API at `http://localhost:5166/api/user-profiles`

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```

Then open the browser at the URL shown in the terminal.

## Notes

- Backend must be running separately on port `5166`
- The app uses `fetch()` to call the backend API
- This is a lightweight frontend for the user profile service
