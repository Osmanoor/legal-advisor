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
RUN mkdir -p /app/data /app/chroma_db_ar /app/chroma_db_en /app/credentials /app/backend/library

# Copy the library folder first (if it exists)
COPY library /app/backend/library

# Copy the entire application content
COPY . .

# Expose port 8080 (used by the app)
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=app/app.py
ENV PORT=8080
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Start the app
CMD ["python", "run.py"]
