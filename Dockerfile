FROM node:14

# ENV NODE_ENV production

WORKDIR /code/cloud-sleep-hub

ADD . /code/cloud-sleep-hub

RUN npm i @antfu/ni -g
RUN npm i pnpm -g
RUN ni

EXPOSE 3000

CMD nr start
