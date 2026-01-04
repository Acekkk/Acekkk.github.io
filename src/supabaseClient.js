import { createClient } from '@supabase/supabase-js';

// 替换为您的 Supabase 项目配置
// 请在 Supabase Dashboard 中获取这些值：https://app.supabase.com/
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 检查是否配置了 Supabase
export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// 只在配置了环境变量时创建客户端，否则导出 null
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
