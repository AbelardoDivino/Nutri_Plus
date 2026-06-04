FROM node:20

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install

COPY . .

EXPOSE 3001

CMD ["node", "backend/server.js"]
