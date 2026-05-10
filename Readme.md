# Aura Detection – AI Powered Chakra Analysis System

## Overview

Aura Detection is an AI-powered wellness and personality analysis platform that combines:

* **Face Detection & Facial Feature Analysis**
* **Chakra Mapping System**
* **Quiz-Based Personality & Energy Analysis**
* **Visualization of Chakra Balance**
* **Aura Interpretation Logic**

The project analyzes user facial expressions and user-provided quiz responses to estimate emotional energy patterns and map them to the seven chakras.

The system is designed as an experimental fusion of:

* Computer Vision
* Machine Learning Concepts
* Psychological Pattern Mapping
* Chakra-Based Energy Interpretation
* Interactive Web Technologies

---

# Main Features

## Face Detection & Analysis

The application uses AI-based facial detection techniques to:

* Detect the human face from webcam/image input
* Extract facial landmarks and emotional indicators
* Analyze expressions and visual traits
* Estimate emotional balance patterns
* Map emotional patterns to chakra states

### Facial Parameters Considered

The system may analyze:

* Eye openness
* Smile intensity
* Facial symmetry
* Expression confidence
* Emotion indicators
* Face orientation
* Stress or calmness patterns

These metrics are then associated with chakra interpretations.

---

## Chakra Mapping System

The platform maps detected emotional and behavioral patterns into the **7 Chakra System**.

### Supported Chakras

| Chakra              | Color  | Associated Traits                   |
| ------------------- | ------ | ----------------------------------- |
| Root Chakra         | Red    | Stability, grounding, survival      |
| Sacral Chakra       | Orange | Creativity, emotions, relationships |
| Solar Plexus Chakra | Yellow | Confidence, willpower, identity     |
| Heart Chakra        | Green  | Love, empathy, compassion           |
| Throat Chakra       | Blue   | Communication, truth, expression    |
| Third Eye Chakra    | Indigo | Intuition, awareness                |
| Crown Chakra        | Violet | Spirituality, consciousness         |

The analysis engine predicts which chakras appear:

* Balanced
* Overactive
* Underactive
* Dominant

---

# Quiz-Based Chakra Analysis

Apart from AI face analysis, the system also includes a psychological/personality-based chakra quiz.

## How the Quiz Works

Users answer multiple questions related to:

* Emotional behavior
* Social interaction
* Confidence levels
* Communication habits
* Spiritual mindset
* Creativity
* Mental clarity
* Fear and stress patterns

Each answer contributes weighted scores to different chakras.

---

## Quiz Analysis Logic

The backend calculates:

```text
User Responses
      ↓
Emotion/Behavior Mapping
      ↓
Weighted Chakra Scoring
      ↓
Dominant Chakra Detection
      ↓
Aura Interpretation
```

The scoring system assigns values to chakra categories and determines:

* Strongest chakra
* Weakest chakra
* Emotional imbalance
* Aura characteristics

---

# Aura Detection Workflow

```text
User Input
   ├── Face Scan
   └── Chakra Quiz

        ↓

AI Processing Layer
   ├── Face Detection
   ├── Feature Extraction
   ├── Emotion Analysis
   └── Quiz Score Evaluation

        ↓

Chakra Mapping Engine

        ↓

Aura Result Generation

        ↓

Visualization Dashboard
```

---

# Tech Stack

## Frontend

The frontend provides an interactive UI for users to:

* Upload/capture face images
* Take chakra quizzes
* View aura reports
* Visualize chakra strengths

### Technologies Used

* React.js / Next.js
* HTML5
* CSS3
* Tailwind CSS
* JavaScript / TypeScript
* Framer Motion
* Chart Libraries

---

## Backend

The backend handles:

* Face processing
* Chakra scoring logic
* AI calculations
* API handling
* Result generation

### Technologies Used

* Node.js
* Express.js
* Python (for AI/ML modules)
* REST APIs

---

## AI / Computer Vision

The AI layer may use:

* OpenCV
* TensorFlow
* MediaPipe
* face-api.js
* Machine Learning Models
* Facial Landmark Detection

---

## Database

Database technologies:
* MySQL

Used for:

* User data
* Quiz results
* Aura reports
* Session management

---

# How Chakra Mapping Works

## Face-Based Mapping

Facial features are translated into emotional indicators.

Example:

| Detected Pattern         | Chakra Influence      |
| ------------------------ | --------------------- |
| High confidence          | Solar Plexus          |
| Calm expression          | Heart Chakra          |
| Strong eye focus         | Third Eye Chakra      |
| Nervousness              | Root Chakra imbalance |
| Communication confidence | Throat Chakra         |

---

## Quiz-Based Mapping

Each question belongs to one or more chakra categories.

Example:

| Question Type   | Chakra        |
| --------------- | ------------- |
| Fear & security | Root Chakra   |
| Creativity      | Sacral Chakra |
| Confidence      | Solar Plexus  |
| Empathy         | Heart Chakra  |
| Communication   | Throat Chakra |
| Intuition       | Third Eye     |
| Spirituality    | Crown Chakra  |

The final score is calculated using weighted averages.

---

# Project Architecture

```text
Frontend
   ↓
API Layer
   ↓
AI Processing Engine
   ├── Face Detection Module
   ├── Emotion Analysis
   ├── Chakra Mapping Logic
   └── Quiz Analyzer
   ↓
Database
   ↓
Result Visualization
```

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/CodeBySushant/AuraDetection.git
cd AuraDetection
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

or

```bash
npm start
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret
API_KEY=your_api_key
```

---

# Future Improvements

## Planned Features

* Real-time webcam aura scanning
* Advanced emotion recognition
* AI-generated wellness suggestions
* Personalized chakra balancing exercises
* Meditation recommendations
* Voice-based emotional analysis
* Mobile application support
* Authentication system
* Historical aura tracking

---

# Use Cases

This project can be used for:

* AI experimentation
* Chakra visualization systems
* Wellness applications
* Emotion analysis research
* Computer vision learning
* Personality assessment systems
* Interactive AI demos

---

# Screenshots

Add screenshots of:

* Home Page
* Face Detection Screen
* Chakra Visualization Dashboard
* Quiz Interface
* Aura Result Page

---

# Challenges Solved

## Combining AI with Spiritual Mapping

One of the major challenges was mapping facial/emotional indicators into chakra interpretations in a meaningful way.

The project attempts to bridge:

* Technology
* Psychology
* Visualization
* Human emotional patterns
* Chakra-based symbolic systems

---

# Learning Outcomes

This project helped in understanding:

* Computer Vision fundamentals
* Facial landmark detection
* Emotion mapping
* Full-stack application architecture
* API development
* Chakra visualization logic
* User interaction systems

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by **Sushant Sharma**

Repository: [AuraDetection Repository](https://github.com/CodeBySushant/AuraDetection)
