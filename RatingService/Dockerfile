# Use the official Python image as the base image
FROM python:3.8-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python code to the container
COPY . .

# Expose the port on which the Flask app will run
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=RatingService.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask app when the container starts
CMD ["flask", "run"]