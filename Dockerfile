# 使用官方 Node.js 镜像（建议指定版本）
FROM node:22-alpine

# 设置npm镜像源（阿里云镜像）
RUN npm config set registry https://registry.npmmirror.com

# 创建并设置工作目录（自动处理路径分隔符）
WORKDIR /opt/test-nextauth

# 先复制package.json文件（利用Docker缓存层, 缓存之前的依赖安装结果，避免重复安装）
COPY package.json .
COPY package-lock.json .

# 安装依赖  --silent
RUN npm ci --verbose

# 复制项目其余文件
COPY . .

RUN ls -l ./node_modules
RUN ls -l ./

RUN npm run build

# 暴露Next.js默认端口
EXPOSE 3000

# 启动命令（根据实际需求修改）
CMD ["npm", "start"]