# Supabase 数据库设置指南

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - **Name**: AI Workshop
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择离你最近的区域
4. 点击 "Create new project" 等待创建完成

## 2. 获取 API 密钥

1. 进入项目后，点击左侧菜单 **Settings** → **API**
2. 找到以下信息并复制：

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...（以 eyJhbGc 开头）
```

3. 将这些值填入 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 3. 创建数据表

在 Supabase Dashboard 中，打开 **SQL Editor**，运行以下 SQL 创建表结构：

### 工具表 (tools)

```sql
-- 创建工具表
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'other',
  icon VARCHAR(10) DEFAULT '🔧',
  url TEXT,
  status VARCHAR(20) DEFAULT 'building',
  stars INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  thumbnail TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Row Level Security (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 策略：所有人可以查看公开工具
CREATE POLICY "Public tools are viewable by everyone"
  ON tools FOR SELECT
  USING (is_public = true);

-- 策略：用户只能管理自己的工具
CREATE POLICY "Users can manage their own tools"
  ON tools FOR ALL
  USING (auth.uid() = user_id);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 用户资料表 (profiles)

```sql
-- 创建用户资料表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 策略：用户只能管理自己的资料
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 自动创建资料（用户注册时触发）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## 4. 配置认证

1. 进入 **Authentication** → **Settings**
2. 配置 Site URL：`http://localhost:3000`（开发环境）
3. 添加 Redirect URLs：
   - `http://localhost:3000/auth/callback`（开发）
   - `https://your-domain.com/auth/callback`（生产）
4. 启用你需要的登录方式：
   - ✅ Email/Password
   - ✅ Google OAuth（可选）

### 配置 Google OAuth（可选）

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 Client ID
3. 在 Supabase **Authentication** → **Providers** → **Google** 中填入：
   - Client ID
   - Client Secret

## 5. 测试连接

启动开发服务器：

```bash
npm run dev
```

访问 `http://localhost:3000`，你应该能看到完整的网站。

## 6. 部署到 Vercel

1. 在 [Vercel](https://vercel.com) 注册并登录
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 在 Environment Variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 点击 Deploy

## 故障排除

### CORS 错误
确保 Supabase 项目设置中允许你的域名。

### 认证不工作
检查 Redirect URLs 配置是否包含你的网站 URL。

### 数据库权限问题
确认 Row Level Security 策略设置正确。

---

需要帮助？随时提问！
