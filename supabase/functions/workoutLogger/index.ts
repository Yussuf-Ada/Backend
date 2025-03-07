import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method === "GET" && req.url.includes("/exercises")) {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (req.method === "POST") {
      const { exercise, sets, reps, weight, category } = await req.json();
      const { error } = await supabase
        .from("workouts")
        .insert([{ exercise, sets, reps, weight, category }]);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Workout logged!" }),
        { headers: corsHeaders }
      );
    }

    if (req.method === "PUT") {
      const { id, exercise, sets, reps, weight, category } = await req.json();
      const { error } = await supabase
        .from("workouts")
        .update({ exercise, sets, reps, weight, category })
        .eq("id", id);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Workout updated!" }),
        { headers: corsHeaders }
      );
    }

    if (req.method === "DELETE") {
      const id = req.url.split("/").pop();
      const { error } = await supabase.from("workouts").delete().eq("id", id);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Workout deleted!" }),
        { headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
