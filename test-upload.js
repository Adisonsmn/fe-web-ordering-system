import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://aouzclztehwqedmjvcjo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXpjbHp0ZWh3cWVkbWp2Y2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDA5OTMsImV4cCI6MjA5NTAxNjk5M30.wDo56HC4RTnICnwNtJLYnvT8lHauLzDNFTEnROQglHY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  const dummyContent = 'Hello World';
  const file = new Blob([dummyContent], { type: 'text/plain' });
  
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload('test.txt', file, { upsert: true });

  if (error) {
    console.error('Upload Error:', error);
  } else {
    console.log('Upload Success:', data);
  }
}

testUpload();
