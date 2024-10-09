#!/bin/bash

set -euo pipefail

# 定义一些变量
ASSET_BUCKET=$1
TIMESTAMP=$2
LAMBDA_DIST_DIR="${CODEBUILD_SRC_DIR}/lambda/dist"

# 遍历 lambda/dist 目录下的所有文件夹并进行打包和上传
for lambda_dir in ${LAMBDA_DIST_DIR}/*; do
  if [ -d "$lambda_dir" ]; then
    lambda_name=$(basename "$lambda_dir")
    echo "Processing $lambda_name..."
    cd "$lambda_dir"
    zip_file="${lambda_name}-${TIMESTAMP}.zip"
    zip -rq "$zip_file" .
    aws s3 cp "$zip_file" "s3://${ASSET_BUCKET}/${zip_file}" --acl bucket-owner-full-control
  fi
done

# layer 打包和上传
cd ${CODEBUILD_SRC_DIR}/lambda/common-layer/nodejs
npm ci --omit=dev
cd ${CODEBUILD_SRC_DIR}/lambda/common-layer
zip -rq common-layer-${TIMESTAMP}.zip .
aws s3 cp common-layer-${TIMESTAMP}.zip s3://$ASSET_BUCKET/common-layer-${TIMESTAMP}.zip --acl bucket-owner-full-control

# 返回初始目录
cd "${CODEBUILD_SRC_DIR}"