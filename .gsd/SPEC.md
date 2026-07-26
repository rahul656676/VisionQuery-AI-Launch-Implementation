# VisionQuery AI - Product Specification

**Status:** FINALIZED

## 1. Overview
VisionQuery AI is a SaaS platform that allows users to upload images and videos, automatically analyzes them using AI (object detection, OCR, scene analysis), and allows users to search, query (chat), and generate reports based on the analyzed visual content.

## 2. Core Features
- **Upload System:** Drag-and-drop uploads for images and videos to Supabase Storage.
- **Image Analysis Pipeline:** Preprocessing, object detection, person attribute estimation (age/gender/emotion with uncertainty), OCR, and scene summary.
- **Video Analysis Pipeline:** Scene detection (PySceneDetect), keyframe extraction (FFmpeg), object detection, OCR, tracking, and timeline generation.
- **Chat & Search:** Chat UI connected to analyzed visual context, semantic search over content, report generation (PDF/CSV/Excel).
- **SaaS Foundation:** Auth, billing/subscriptions, usage quotas, admin dashboard, analytics.

## 3. Tech Stack
- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python
- **Database/Auth/Storage:** Supabase
- **Architecture:** Clean Architecture on the backend, reusable components on the frontend, production-ready design.

## 4. Open Questions / Clarifications
- We will be using the Groq API for verification and potentially for the chat/LLM logic as mentioned by the user. Do we need to set up the Groq client early on in Phase 1?
- Please confirm if the proposed phases in the ROADMAP accurately reflect your desired sequence of work.
