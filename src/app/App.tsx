// src/app/App.tsx
import React, { useState, useEffect } from "react";
import {
  PreviewVoiceNote,
  RecordingStatus,
  VoiceRecorder,
} from "@ananay-nag/react-voice-recorder";
import "./App.css";

interface AudioDetails {
  blob: Blob;
  url: string;
  isRecording: boolean;
  size?: number | 0;
}

interface Answer {
  text: string;
  audioDetails: AudioDetails | null;
  isRecording: boolean;
}

interface FormData {
  name: string;
  email: string;
  answers: Answer[];
}

interface Errors {
  activeRecordingError?: string;
  name?: string;
  email?: string;
  questions?: Record<number, string>;
}

function App() {
  const predefinedQuestions: string[] = [
    "Tell us about your favorite hobby or pastime.",
    "What was your most memorable travel experience?",
    "How would you describe your ideal work environment?",
    "What skills are you looking to develop in the next year?",
  ];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    answers: predefinedQuestions.map(() => ({
      text: "",
      audioDetails: null,
      isRecording: false,
    })),
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [activeVoiceQuestionIndex, setActiveVoiceQuestionIndex] = useState<
    number | null
  >(null);

  // Monitor for active recordings
  useEffect(() => {
    const recordingIndex = formData.answers.findIndex(
      (answer) => answer.isRecording
    );
    setActiveVoiceQuestionIndex(recordingIndex !== -1 ? recordingIndex : null);
  }, [formData.answers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRecordedData = (
    data: {
      blob: Blob;
      url: string;
      type: string;
      isRecording: boolean;
      size?: number;
    },
    questionIndex: number
  ) => {
    // Update the specific question's data
    const updatedAnswers = [...formData.answers];
    updatedAnswers[questionIndex] = {
      ...updatedAnswers[questionIndex],
      audioDetails: data,
      isRecording: data.isRecording,
    };
    setFormData({
      ...formData,
      answers: updatedAnswers,
    });
    setErrors({ activeRecordingError: "" });
  };

  const handleTextAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index].text = value;
    setFormData({
      ...formData,
      answers: updatedAnswers,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    let isAnyActiveRecording = false;
    formData.answers.forEach((answer: Answer, index: number) => {
      if (answer.audioDetails?.isRecording) {
        isAnyActiveRecording = true;
        newErrors.activeRecordingError = `Recording in progress for Question ${
          index + 1
        }`;
        return false; // Stop checking further if any recording is active
      }
    });

    setErrors(newErrors);
    // If any question is being recorded, don't check for empty answers
    if (isAnyActiveRecording) {
      return !isAnyActiveRecording;
    }

    const questionErrors: Record<number, string> = {};
    formData.answers.forEach((answer: Answer, index: number) => {
      if (answer.text.trim() === "" && answer.audioDetails === null) {
        questionErrors[index] = `Please provide an answer for Question ${
          index + 1
        }`;
      }
    });

    if (Object.keys(questionErrors).length > 0) {
      newErrors.questions = questionErrors;
    }

    setErrors(newErrors);
    // Check if there are any errors

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
    } else {
      // setTimeout(() => {
      //   const errorElement = document.querySelector(".error-text");
      //   if (errorElement) {
      //     errorElement.scrollIntoView({ behavior: "smooth", });
      //   }
      // }, 100);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container">
        <div className="success-message">
          <h2>Thank you for your submission!</h2>
          <p>Your responses have been recorded.</p>
          <button
            className="btn"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                answers: predefinedQuestions.map(() => ({
                  text: "",
                  audioDetails: null,
                  isRecording: false,
                })),
              });
              setIsSubmitted(false);
              setActiveVoiceQuestionIndex(null);
            }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Interview Questions</h1>
      <p className="description">
        Please answer all the following questions by typing your response or
        recording your voice.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="personal-info">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error-input" : ""}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
        </div>

        <h2>
          Questions{" "}
          <span className="required-note">All questions require an answer</span>
        </h2>

        {predefinedQuestions.map((question, index) => (
          <div
            key={index}
            className={`question-container ${
              errors.questions && errors.questions[index]
                ? "question-error"
                : ""
            }`}
          >
            <div className="question-heading">
              <h3>
                Question {index + 1} <span className="required">*</span>
              </h3>
            </div>

            <p className="question-text">{question}</p>

            <div className="answer-section">
              <div className="form-group">
                <label htmlFor={`text-answer-${index}`}>
                  {formData.answers[index].audioDetails
                    ? "Text Answer (Optional if voice recorded)"
                    : "Text Answer"}
                </label>
                <textarea
                  id={`text-answer-${index}`}
                  value={formData.answers[index].text}
                  onChange={(e) =>
                    handleTextAnswerChange(index, e.target.value)
                  }
                  className={
                    errors.questions && errors.questions[index]
                      ? "error-input"
                      : ""
                  }
                />

                {/* Show recorder conditionally - when it's the active one OR no recorders are active */}
                {(activeVoiceQuestionIndex === null ||
                  activeVoiceQuestionIndex === index) && (
                  <div className="recorder-container">
                    <VoiceRecorder
                      onDataRecorded={(data) => handleRecordedData(data, index)}
                      duration={60}
                      compressionLevel={"medium"}
                    />
                  </div>
                )}

                <br />
                <RecordingStatus
                  isRecording={formData.answers[index].isRecording}
                />
                <br />
                {formData.answers[index].audioDetails && (
                  <PreviewVoiceNote
                    audioUrl={formData.answers[index].audioDetails?.url ?? null}
                    key={index}
                  ></PreviewVoiceNote>
                )}
              </div>

              {errors.questions && errors.questions[index] && (
                <p className="error-text">{errors.questions[index]}</p>
              )}
            </div>
          </div>
        ))}
        {errors.activeRecordingError && (
          <p className="error-text">{errors.activeRecordingError}</p>
        )}
        <div className="submit-note">
          <p>
            <span className="required">*</span> indicates a required field
          </p>
        </div>
        <button type="submit" className="btn submit-btn">
          Submit All Answers
        </button>
      </form>
    </div>
  );
}

export default App;
