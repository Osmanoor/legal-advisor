# Use the Python slim image for a lean production environment
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies needed by some Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker's build cache
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application, which now includes the production .env file
# and the pre-built frontend assets in backend/app/static/
COPY backend/ .

# Expose the port Gunicorn will run on
EXPOSE 8080

# Set environment variables for the container
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=run:app
ENV PYTHONPATH=/app

# Use Gunicorn to run the application in production. This is more robust
# than the Flask development server.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 "run:app"