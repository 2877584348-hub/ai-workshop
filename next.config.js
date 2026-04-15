/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // 在构建时（prerender 阶段）环境变量不存在
    // 用空字符串替换，让 @supabase/ssr 的报错被 catch 住
    config.plugins.push(
      new config.webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      })
    )
    return config
  },
}

module.exports = nextConfig
