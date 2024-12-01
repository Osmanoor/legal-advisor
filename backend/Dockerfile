# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY . .

# Expose port 8080 (Cloud Run expects port 8080)
EXPOSE 8080

# Set environment variable for Flask
ENV FLASK_APP=app.py
ENV PORT=8080

# Run the Flask app
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app