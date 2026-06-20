# Use lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your backend application code
COPY . .

# Run the FastAPI server on port 7860 (Hugging Face Requirement)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]