FROM node:18

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install

COPY frontend/nutri/package*.json frontend/nutri/
RUN cd frontend/nutri && npm install

COPY . .

RUN cd frontend/nutri && npm run build

EXPOSE 3001

CMD ["node", "backend/server.js"]
