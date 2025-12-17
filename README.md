# ShaktiSetu Home

React application for ShaktiSetu home page and acknowledgement route.

## Features

- **Home Page (`/`)**: Simple HTML landing page
- **Acknowledgement Route (`/ack`)**: Accepts a `token` parameter and calls the Supabase `acknowledge-sms-notification` edge function

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for production:
```bash
npm build
```

## Routes

### Home Page
- **URL**: `http://localhost:3000/`
- **Description**: Serves a simple HTML landing page

### Acknowledgement Route
- **URL**: `http://localhost:3000/ack?token=xxxxx`
- **Parameters**:
  - `token` (required): The acknowledgement token to process
- **Description**: Calls the Supabase `acknowledge-sms-notification` edge function with the provided token and displays the result

## Project Structure

```
src/
  app/
    App.tsx          # Main app component with routing
    App.css          # App styles
    index.tsx        # App entry point
    index.css        # Global styles
  components/
    HomePage/        # Home page component
    AckPage/         # Acknowledgement page component
  lib/
    supabaseClient.ts # Supabase client configuration
```

## Environment Variables

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Note: All environment variables must be prefixed with `REACT_APP_` to be accessible in the React app.
