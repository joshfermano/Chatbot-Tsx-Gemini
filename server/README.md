# Perps Chatbot Server

A Node.js backend server for the University of Perpetual Help System Dalta - Molino Campus AI Chatbot.

## Setup

### Prerequisites

- Node.js 18+
- MongoDB

### Installation

1. Clone the repository

```
git clone <repository-url>
cd perps-chatbot-ts/server
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGO_URL=mongodb://localhost:27017/perpsbot
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server

```
npm run dev
```

## API Endpoints

### Chat API

- `POST /api/chat` - Send a message to the chatbot
  - Request Body: `{ "message": "your message here" }`
  - Response: `{ "response": "chatbot response" }`

## Technology Stack

- **Express.js** - Web server framework
- **MongoDB/Mongoose** - Database
- **Google Generative AI (Gemini)** - AI model for the chatbot

## Development

### Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm start` - Run the built project

## Chatbot Configuration

The chatbot is configured using the Gemini AI model, with custom conversation history and system instructions to act as "Perps", the University of Perpetual Help System Dalta - Molino Campus AI assistant.

The chatbot is trained to:

- Answer questions about University programs, facilities, and services
- Provide information about admissions, academics, and events
- Maintain a conversational, helpful tone
- Respond with "Sorry, my knowledge is limited for the University only" when asked about topics outside its scope
