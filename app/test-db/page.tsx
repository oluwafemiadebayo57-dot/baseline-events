// app/test-db/page.tsx
// TEMPORARY test page to verify Supabase connection.
// We'll delete this once we know it works.

import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  // Try reading settings — if it works, we're connected.
  const { data, error } = await supabase.from("settings").select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        Supabase Connection Test
      </h1>
      {error && (
        <div className="mt-4 rounded bg-red-100 p-4">
          <strong>Error:</strong> {error.message}
        </div>
      )}
      {data && (
        <div className="mt-4 rounded bg-green-100 p-4">
          <strong>✅ Connected!</strong>
          <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}