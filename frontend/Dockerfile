FROM node:24.11.1
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV EXPO_PORT=3000

CMD ["npx", "expo", "start", "--web", "--port", "3000"]
