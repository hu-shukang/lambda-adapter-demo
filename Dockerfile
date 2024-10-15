FROM public.ecr.aws/docker/library/node:20.12-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
EXPOSE 3000
WORKDIR "/var/task/build"
ADD package.json /var/task/package.json
ADD package-lock.json /var/task/package-lock.json
RUN npm ci --omit=dev
ADD build /var/task/build
CMD ["npm", "run", "start"]