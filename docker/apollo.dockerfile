FROM node:20.9.0
EXPOSE 4000
COPY dist package.json package-lock.json  app/
WORKDIR /app
RUN npm ci
CMD ["npm","run","start"]