FROM node:18-alpine

WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Make wait script executable
COPY scripts/wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

EXPOSE 5000

CMD ["/wait-for-db.sh", "db", "npm", "run", "dev"]