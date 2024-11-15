# 构建阶段
FROM public.ecr.aws/docker/library/node:20.12-alpine AS builder

WORKDIR /app

# 安装依赖并生成 Prisma 客户端
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate
COPY build/server ./build/server

# 运行阶段
FROM public.ecr.aws/docker/library/node:20.12-alpine

# 添加 Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /var/task

# 仅复制运行所需文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/build/server ./build/server

EXPOSE 3000

CMD ["npm", "run", "start"]
