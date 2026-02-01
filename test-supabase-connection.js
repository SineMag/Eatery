// Test Supabase Connection
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rvkktmhnbgslmqwrjrks.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2a2t0bWhuYmdzbG1xd3JqcmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTIxOTUsImV4cCI6MjA4NTE2ODE5NX0.n7vGwhcZI_GMPvWJ6bVEkzI9InUPRAmCLqA4yyXli44";

console.log("Testing Supabase connection...");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseAnonKey.substring(0, 20) + "...");

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Test basic connection
  async function testConnection() {
    try {
      console.log("\n1. Testing basic connection...");

      // Test auth service
      console.log("2. Testing auth service...");
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Auth service error:", error.message);
      } else {
        console.log("✅ Auth service is working");
        console.log("Current session:", data.session ? "Active" : "None");
      }

      // Test if we can access the users table (if it exists)
      console.log("\n3. Testing database access...");
      const { data: tables, error: tablesError } = await supabase
        .from("users")
        .select("*")
        .limit(1);

      if (tablesError) {
        console.log("⚠️  Users table test:", tablesError.message);
        console.log("   This might be normal if the table doesn't exist yet");
      } else {
        console.log("✅ Database access working");
        console.log("Found users:", tables.length);
      }

      // Test signup with a test user
      console.log("\n4. Testing user signup...");
      const testEmail = `test${Date.now()}@test.com`;
      const testPassword = "test123456";

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              name: "Test User",
            },
          },
        });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError.message);
      } else {
        console.log("✅ Signup successful!");
        console.log("User ID:", signUpData.user?.id);
        console.log("Email:", signUpData.user?.email);

        // Test login with the created user
        console.log("\n5. Testing login...");
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

        if (signInError) {
          console.error("❌ Login error:", signInError.message);
        } else {
          console.log("✅ Login successful!");
          console.log("Session active:", signInData.session ? "Yes" : "No");
        }
      }
    } catch (err) {
      console.error("❌ Connection test failed:", err.message);
    }
  }

  testConnection();
} catch (err) {
  console.error("❌ Failed to create Supabase client:", err.message);
}
