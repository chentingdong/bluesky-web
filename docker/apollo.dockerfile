FROM node:20.9.0
EXPOSE 4000
COPY dist package.json yarn.lock  app/
WORKDIR /app
RUN yarn install --frozen-lockfile
CMD ["yarn","run","start"]