# Vercel 部署指南

## 什么是 Vercel？

Vercel 是**Next.js 官方推荐的部署平台**，提供：
- 自动部署
- CDN 加速
- 免费 HTTPS
- 全球边缘网络

**优点：**
- ✅ 免费额度充足
- ✅ 自动 CI/CD
- ✅ 零配置部署
- ✅ 预览环境

---

## 注册和准备

### 1. 注册账号

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up"
3. 使用 GitHub 账号登录（推荐）

### 2. 准备代码

确保代码已推送到 GitHub：

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 部署步骤

### 1. 导入项目

1. 登录 Vercel Dashboard
2. 点击 "Add New..." → "Project"
3. 选择 GitHub 仓库
4. 点击 "Import"

### 2. 配置项目

Vercel 会自动检测 Next.js，配置如下：

**Project Settings:**
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（项目根目录）
- **Build Command**: `npm run build`（自动）
- **Output Directory**: `.next`（自动）

### 3. 环境变量

点击 "Environment Variables"，添加：

```env
# 生产环境变量
NODE_ENV=production
DB_TYPE=postgresql
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

**注意：**
- 每个环境变量单独添加
- 选择环境（Production, Preview, Development）

### 4. 部署

1. 点击 "Deploy"
2. 等待构建完成（2-5 分钟）
3. 部署成功后获得 URL：`your-project.vercel.app`

---

## 自动部署

### 1. Git 集成

Vercel 自动监听 Git 推送：
- **main 分支** → 生产环境
- **其他分支** → 预览环境

### 2. 预览部署

每次 Push 到非 main 分支，自动创建预览：
- URL: `your-project-git-branch.vercel.app`
- 用于测试和代码审查

---

## 自定义域名

### 1. 添加域名

1. 进入项目 Settings → Domains
2. 输入你的域名（如：`freetools.com`）
3. 点击 "Add"

### 2. 配置 DNS

Vercel 会显示 DNS 配置：

**CNAME 记录：**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**或 A 记录：**
```
Type: A
Name: @
Value: 76.76.21.21
```

在域名服务商添加这些记录。

### 3. 等待生效

DNS 生效需要 1-24 小时，Vercel 会自动配置 HTTPS。

---

## 环境变量管理

### 1. 添加变量

Settings → Environment Variables → Add：

- **Key**: `SUPABASE_URL`
- **Value**: `https://xxx.supabase.co`
- **Environment**: Production

### 2. 更新变量

修改后需要**重新部署**才能生效。

---

## 监控和分析

### 1. Analytics（可选）

Vercel 提供分析功能（付费）：
- 页面访问量
- 性能指标
- 用户地理位置

### 2. Logs

查看部署和运行日志：
- 构建日志
- 运行时错误
- API 请求日志

---

## 免费额度

**Hobby 计划（免费）：**
- 带宽：100GB/月
- 构建时间：6000 分钟/月
- 项目数量：无限制
- 团队成员：1 人

**对于个人项目完全够用！**

---

## 常见问题

### Q: 构建失败怎么办？

A: 
1. 查看构建日志
2. 检查环境变量
3. 检查代码错误
4. 查看 Vercel 文档

### Q: 如何回滚到之前的版本？

A: 
1. 进入 Deployments
2. 找到之前的版本
3. 点击 "..." → "Promote to Production"

### Q: 如何设置自定义构建命令？

A: 
Settings → General → Build & Development Settings

---

## 学习资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel 部署指南](https://vercel.com/docs/deployments/overview)

---

## 总结

- Vercel = Next.js 官方部署平台
- 注册 → 导入项目 → 配置环境变量 → 部署
- 自动 CI/CD，每次 Push 自动部署
- 免费额度充足，适合个人项目

