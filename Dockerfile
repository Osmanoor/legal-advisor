# Stage 1: Build the frontend
# Use a Node.js image to have access to npm
FROM node:20-alpine AS builder

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy package files and install dependencies
# This leverages Docker's cache. It only re-runs if package files change.
COPY frontend_v2/package.json frontend_v2/package-lock.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend_v2/ ./

# Run the production build
RUN npm run build

# Stage 2: Build the final production image
# Use the Python slim image as before
FROM python:3.12-slim

# Set working directory for the backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first for caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application
COPY backend/ .

# --- CRITICAL STEP ---
# Copy the built frontend assets from the 'builder' stage
# The destination MUST match the static_folder path in Flask ('app/static')
COPY --from=builder /app/frontend/dist /app/app/static

# Expose the port Gunicorn will run on
EXPOSE 8080

# Set environment variables for Gunicorn
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=run:app

# Use Gunicorn to run the application in production
# This is more robust than the Flask development server.
# It looks for the 'app' object in the 'run' module (run.py).
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 "run:app"