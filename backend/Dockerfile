# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for ChromaDB
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create directories for ChromaDB, data, and credentials
RUN mkdir -p /app/data /app/chroma_db_ar /app/chroma_db_en /app/credentials /app/مكتبة\ المشتريات

# Copy Google Cloud credentials
COPY my-project-2024-441219-045b8286058d.json /app/credentials/

# Copy the library folder first
COPY مكتبة\ المشتريات /app/مكتبة\ المشتريات/

# Copy the entire application
COPY . .

# Expose port 8080 (Cloud Run expects port 8080)
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=app/app.py
ENV PORT=8080
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/my-project-2024-441219-045b8286058d.json

# Run the Flask app with gunicorn
CMD exec gunicorn --bind :$PORT \
    --workers 1 \
    --threads 8 \
    --timeout 0 \
    --chdir /app \
    --access-logfile - \
    --error-logfile - \
    app.app:app
