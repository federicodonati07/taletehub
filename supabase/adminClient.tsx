import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default supabaseAdmin