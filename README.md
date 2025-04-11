# react-voice-demo-app# Interview Questions Application

## Overview
This application is a dynamic interview questionnaire that allows users to submit responses to predefined questions using either text input or voice recordings. It provides a user-friendly interface for collecting interview responses with validation and submission functionality.

## Features

- **Personal Information Collection**: Captures the user's name and email address
- **Predefined Questions**: Presents a set of interview questions to the user
- **Multiple Answer Methods**: 
  - Text input for written responses
  - Voice recording capability for audio responses
- **Single Recording Session**: Prevents multiple recording sessions by:
  - Allowing only one active recording at a time
  - Temporarily hiding other recording options while recording is in progress
  - Displaying recording status indicators
- **Form Validation**:
  - Ensures name and email are provided
  - Validates email format
  - Requires an answer (text or audio) for each question
  - Prevents submission while recording is in progress
- **Audio Playback**: Preview recorded answers before submission
- **Success Feedback**: Confirmation screen with option to submit another response

## Technical Implementation

### Component Structure
The application is built as a single React component (`App.tsx`) that manages:
- Form state and validation
- Audio recording logic
- User interactions and feedback

### Key Technologies
- **React**: For building the UI and managing component state
- **TypeScript**: For type safety and interface definitions
- **@ananay-nag/react-voice-recorder**: For handling voice recording functionality

### State Management
The application uses React's `useState` hooks to manage:
- Form data (name, email, and answers)
- Submission status
- Validation errors
- Active recording tracking

### User Experience Improvements
- Active recording indicators
- Error messaging for validation issues
- Dynamic visibility of recording controls
- Responsive form layout

## How It Works

1. Users enter their name and email
2. For each question, users can:
   - Type a text response
   - Record a voice response (only one recording active at a time)
3. The system validates inputs before submission
4. Upon successful submission, a confirmation screen is shown

## Usage

To use this application:

1. Fill in personal details (name and email)
2. Answer each question with text and/or voice recording
3. To record a voice answer:
   - Click the record button for the desired question
   - Speak your response
   - Click stop when finished
   - Preview your recording with the playback controls
4. Submit the form when all questions are answered

## Dependencies

- React
- TypeScript
- @ananay-nag/react-voice-recorder
- CSS for styling

## Notes

- Voice recordings are limited to 60 seconds per question
- Recordings use medium compression to balance quality and file size
- The application prevents multiple simultaneous recordings to avoid conflicts
