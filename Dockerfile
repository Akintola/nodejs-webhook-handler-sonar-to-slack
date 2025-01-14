FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV PORT=3000

# Run the app
CMD [ "node", "index.js" ]
