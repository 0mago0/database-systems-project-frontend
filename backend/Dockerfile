# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# 複製 package.json
COPY package.json package-lock.json* ./

# 安裝依賴
RUN npm ci --only=production && npm install nodemon

# 複製應用代碼
COPY . .

# 暴露端口
EXPOSE 3002

# 啟動應用
CMD ["npm", "run", "dev"]
