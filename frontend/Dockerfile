FROM node:24.11.1


#RUN useradd -m appuser
WORKDIR /app
#USER appuser

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

