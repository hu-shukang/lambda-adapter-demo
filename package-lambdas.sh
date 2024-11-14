#!/bin/bash

set -euo pipefail

# 定义一些变量
ASSET_BUCKET=$1
TIMESTAMP=$2
LAMBDA_DIST_DIR="${CODEBUILD_SRC_DIR}/lambda/functions"

for lambda_dir in $(find "${LAMBDA_DIST_DIR}" -mindepth 1 -maxdepth 3 -type d); do
  if [ -f "${lambda_dir}/index.js" ]; then
    lambda_name=$(basename "$lambda_dir")
    echo "Processing $lambda_name..."
    cd "$lambda_dir"
    zip_file="${lambda_name}-${TIMESTAMP}.zip"
    zip -rq "$zip_file" .
    aws s3 cp "$zip_file" "s3://${ASSET_BUCKET}/${zip_file}" --acl bucket-owner-full-control
  fi
done

# common layer 打包和上传
cd ${CODEBUILD_SRC_DIR}/lambda/common-layer
zip -rq common-layer-${TIMESTAMP}.zip .
aws s3 cp common-layer-${TIMESTAMP}.zip s3://$ASSET_BUCKET/common-layer-${TIMESTAMP}.zip --acl bucket-owner-full-control

# prisma layer 打包和上传
cd ${CODEBUILD_SRC_DIR}/lambda/prisma-layer
zip -rq prisma-layer-${TIMESTAMP}.zip .
aws s3 cp prisma-layer-${TIMESTAMP}.zip s3://$ASSET_BUCKET/prisma-layer-${TIMESTAMP}.zip --acl bucket-owner-full-control

# 返回初始目录
cd "${CODEBUILD_SRC_DIR}"