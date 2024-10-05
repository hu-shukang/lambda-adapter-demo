FROM public.ecr.aws/docker/library/node:20.12-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
EXPOSE 3000
WORKDIR "/var/task"
ADD package.json /var/task/package.json
ADD package-lock.json /var/task/package-lock.json
RUN npm install --omit=dev
ADD build/ /var/task/build
ADD server/ /var/task/server
CMD ["npm", "run", "start"]