# AI Voice Agent

An AI-powered voice interview application built with Next.js, Vapi AI, and Firebase.

## Features

- AI-powered voice interviews
- Real-time transcription and feedback
- Firebase authentication and data storage
- Responsive design with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id
```

## Troubleshooting

### Meeting Ended Due to Ejection Error

If you encounter the "Meeting ended due to ejection" error, this is typically caused by:

1. **Network connectivity issues** - Check your internet connection
2. **WebSocket connection problems** - The connection to Vapi's servers was interrupted
3. **Server-side issues** - Vapi's servers may be experiencing temporary issues

#### Automatic Recovery

The application includes automatic error recovery:
- **Auto-retry**: Automatically attempts to reconnect up to 3 times
- **Manual retry**: Click the "Retry Now" button to immediately attempt reconnection
- **Connection monitoring**: Continuously monitors connection status

#### Manual Recovery Steps

If automatic recovery fails:

1. **Refresh the page** - This will reinitialize the Vapi SDK
2. **Check your internet connection** - Ensure stable connectivity
3. **Wait a few minutes** - Server issues often resolve quickly
4. **Check Vapi status** - Visit [Vapi status page](https://status.vapi.ai) for service updates

#### Prevention Tips

- Use a stable internet connection
- Avoid switching networks during calls
- Close unnecessary browser tabs/applications
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Common Issues

#### Vapi SDK Not Ready
- Ensure your environment variables are correctly set
- Check that your Vapi token is valid
- Restart the development server

#### Call Start Timeout
- The application includes a 30-second timeout for call initialization
- If you see this error, try again - it's usually temporary

#### WebSocket Errors
- These are automatically caught and handled
- The application will attempt to reconnect automatically

## Development

- **Framework**: Next.js 15 with App Router
- **AI**: Vapi AI for voice interactions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
