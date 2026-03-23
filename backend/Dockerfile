FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (better caching)
COPY package*.json ./
RUN npm install --only=production

# Copy app code
COPY . .

# Create uploads folder with permissions
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "server.js"]