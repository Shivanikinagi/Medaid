# Use Node.js 18 on Debian base image for better compatibility
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create directory for uploads
RUN mkdir -p uploads

# Create directory for Python service
RUN mkdir -p python_service

# Create a virtual environment and install Python dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip
# Install Python packages individually to avoid version conflicts
RUN pip install --no-cache-dir flask==2.3.2
RUN pip install --no-cache-dir flask-cors==4.0.0
RUN pip install --no-cache-dir pymongo==4.5.0
RUN pip install --no-cache-dir python-dotenv==1.0.0
RUN pip install --no-cache-dir pandas==2.0.3
RUN pip install --no-cache-dir scikit-learn==1.3.0
RUN pip install --no-cache-dir langchain==0.0.352
RUN pip install --no-cache-dir langchain-google-genai==0.0.9
RUN pip install --no-cache-dir google-generativeai==0.4.0
# Verify installation
RUN pip list | grep langchain-google-genai

# Expose port
EXPOSE 5008

# Start the application
CMD ["npm", "start"]