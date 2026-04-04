# Frontend Dockerfile for Jobavdihita
FROM node:22-alpine AS builder

WORKDIR /app

# Build arguments
ARG VITE_BACKEND_URL=http://backend:3001
ARG VITE_API_BASE_URL=/api
ARG VITE_GA_ID=

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Create .env file with build variables
RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" > .env && \
    echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" >> .env && \
    echo "VITE_GA_ID=${VITE_GA_ID}" >> .env

# Build the app with environment variables
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5174

# Environment variables
ENV PORT=5174
ENV NODE_ENV=production

# Start the application
CMD ["serve", "-s", "dist", "-l", "5174"]
