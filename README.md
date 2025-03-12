# APA1 Supa Task Backend

## Project Overview

This backend is the API service that powers the Workout Logger application. It handles data management and server-side processing for tracking and managing fitness activities. Built with Supabase Edge Functions, it provides a scalable solution for fitness tracking needs.

## Setup Instructions

1. Clone the repository to your local machine

2. Install dependencies:
   npm install

3. Authenticate with Supabase:
   npx supabase login

4. Link your local project to your Supabase project:
   npx supabase link --project-ref your_project_id

5. Set up environment variables as needed for your deployment

## Features

- **Exercise Management**: Create, read, update, and delete exercises
- **Workout Tracking**: Store workout sessions with detailed exercise data
- **Progress Analytics**: API endpoints for retrieving workout data
- **Serverless Architecture**: Utilises Supabase Edge Functions for scalable performance

## Technology Stack

- Node.js for the serverless function runtime
- Supabase for database and authentication
- Supabase Edge Functions for API endpoints
- TypeScript for type-safe code development

## Edge Functions Development

### Creating a New Function

Create a new Edge Function with:
npx supabase functions new my-function-name

This will create a new function in the supabase/functions/my-function-name/ directory.

### Testing Functions Locally

Test your functions locally before deployment:
npx supabase functions serve

You can then use curl to test your function:
curl http://localhost:54321/functions/v1/my-function-name

### Deploying Functions

Deploy your functions to production:
npx supabase functions deploy

## Integration with Frontend

The backend API is designed to integrate with the Workout Logger frontend application. Endpoints are structured to provide all necessary data operations for the user interface to function effectively.
