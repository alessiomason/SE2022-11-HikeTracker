FROM node:alpine
# RUN sudo apt-get -y update
# RUN sudo apt-get -y upgrade
# RUN sudo apt-get install -y sqlite3 libsqlite3-dev
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
# RUN mkdir /db
# RUN mkdir /x
RUN npm install --save sqlite3
# RUN touch /db/hike_tracker.db
# RUN /usr/bin/sqlite3 /db/hike_tracker.db
# COPY ./usr/bin/sqlite3 ./
COPY ./ ./
# RUN rm ./hike_tracker.db
# RUN rm -f hike_tracker.db
# RUN mv /server/db/hike_tracker.db /server
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "start"]