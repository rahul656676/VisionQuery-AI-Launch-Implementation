# VisionQuery AI - Roadmap

## Phase 1: Foundation (Current)
- Scaffolding Next.js (frontend) and FastAPI (backend).
- Environment variables and Supabase setup.
- Basic database schema (users, uploads, chat_sessions, chat_messages, processing_jobs).
- App shell with login, dashboard layout, and protected routes.
- Placeholders for Upload and Chat pages.

## Phase 2: Upload System
- Drag-and-drop upload UI for images/videos.
- Supabase Storage integration.
- Database insert and processing job creation.

## Phase 3: Image Analysis Pipeline
- Image preprocessing, object detection, person attributes, OCR, scene summary.
- Backend background job integration.
- UI results display.

## Phase 4: Chat, Search & Report
- Chat UI connected to visual context.
- Semantic search over uploaded content.
- Report generation placeholders (PDF/CSV/Excel).

## Phase 5: Video Analysis Pipeline
- Video handling, PySceneDetect, keyframes (FFmpeg), object detection, OCR.
- Video tracking and timeline UI.

## Phase 6: Production Hardening
- Rate limiting, security checks, test suite.
- Error handling, logging, CI/CD setup.

## Phase 7: Product Launch & Admin
- Billing/subscriptions.
- Quota tracking, Admin dashboard, Analytics.
- SEO, notifications, audit logs.
