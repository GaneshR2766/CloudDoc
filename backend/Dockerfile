# Use official Python runtime
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy your app code
COPY . .

# Expose port (Flask default 5000)
EXPOSE 5000

# Set environment variable to run flask app
ENV FLASK_APP=app.py

# Run the app
CMD ["flask", "run", "--host=0.0.0.0"]
