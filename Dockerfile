FROM node:14.18.2-buster-slim as build-steps

ENV WEBROOT /mnt/srv/www/core-business-dashboard/current

ARG npmToken
ARG mapKey

RUN npm config set //registry.npmjs.org/:_authToken=${npmToken}

RUN apt-get update && \
    apt-get -y install \
    git
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
RUN mkdir -p ${WEBROOT}

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR ${WEBROOT}
ADD . ${WEBROOT}

# Clear cache and copy the node_modules to the root folder
RUN rm -rf yarn.lock && rm -rf node_modules

# Install packages
RUN yarn

# Replace the env variables with strings in order to yarn build during the docker build
# and not in the container
RUN sed -i 's/process.env.REACT_APP_ENVIRONMENT/"REACT_APP_ENVIRONMENT"/g; s/process.env.REACT_APP_REGION/"REACT_APP_REGION"/g; s/process.env.REACT_APP_LOCALE/"REACT_APP_LOCALE"/g; s/process.env.REACT_APP_HQ_ENDPOINT/"REACT_APP_HQ_ENDPOINT"/g; s/process.env.REACT_APP_CORE_BUSINESS_BFF_API/"REACT_APP_CORE_BUSINESS_BFF_API"/g;' src/*.js src/data/*.ts
RUN sed -i "s/process.env.REACT_APP_PROVIDER_KEY/'${mapKey}'/g" src/components/*.ts src/components/*.tsx

# build the packages
RUN yarn build

#2nd stage
FROM nginx:1.20.2-alpine

ENV WEBROOT /mnt/srv/www/core-business-dashboard/current

COPY --from=build-steps ${WEBROOT}/build/. /var/www/html/

COPY --from=build-steps ${WEBROOT}/docker-entrypoint.sh /tmp/docker-entrypoint.sh
COPY --from=build-steps ${WEBROOT}/conf/. /etc/nginx/

EXPOSE 80

ENTRYPOINT ["sh", "/tmp/docker-entrypoint.sh"]