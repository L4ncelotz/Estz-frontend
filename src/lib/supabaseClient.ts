// web/src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// ตรวจสอบว่ามีตัวแปร Env ที่จำเป็นหรือไม่
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// สร้าง Supabase Client สำหรับ Frontend
// ใช้ anon key เพราะเป็นฝั่ง public ที่ทุกคนสามารถอ่านได้
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);