FROM node:18-alpine
WORKDIR /app
# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --only=production
# Copy source
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
