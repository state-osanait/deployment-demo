require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendHeartbeat() {
  console.log('💓 Sending heartbeat...');
  const { error } = await supabase
    .from('heartbeats')
    .insert({ source: 'Railway Worker' });

  if (error) console.error('Error:', error);
  else console.log('Success!');
}

// 起動時に1回実行
sendHeartbeat();

// 60秒ごとに実行
setInterval(sendHeartbeat, 60000);

// RailwayのHealth Check用サーバー
http.createServer((req, res) => {
  res.write('Worker is running');
  res.end();
}).listen(process.env.PORT || 8080);
