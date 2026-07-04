const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function createAdmin() {
  const adminEmail = 'arunyadaveluvu@gmail.com';
  const adminPassword = 'Arunkumaryadavt3';

  console.log(`Attempting to programmatically create admin user: ${adminEmail}...`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: 'Arun' }
    });

    if (error) {
      if (error.message.includes('already exists') || error.status === 422) {
        console.log('Admin user already exists in Supabase Auth! You can log in using these credentials.');
      } else {
        console.error('Error creating admin user:', error.message);
      }
    } else {
      console.log('Successfully created and confirmed admin user!');
      console.log('User ID:', data.user.id);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createAdmin();
