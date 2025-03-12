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

    if (req.method === "GET" && req.url.includes("/users")) {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url");

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (req.method === "GET" && req.url.includes("/workouts")) {
      const url = new URL(req.url);
      const userId = url.searchParams.get("user_id");

      if (!userId) {
        return new Response(JSON.stringify({ error: "user_id is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (req.method === "POST") {
      const { exercise, sets, reps, weight, category, user_id } =
        await req.json();

      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const { error } = await supabase
        .from("workouts")
        .insert([{ exercise, sets, reps, weight, category, user_id }]);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Workout logged!" }),
        { headers: corsHeaders }
      );
    }

    if (req.method === "PUT") {
      const { id, exercise, sets, reps, weight, category, user_id } =
        await req.json();

      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const { data, error: fetchError } = await supabase
        .from("workouts")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Convert both values to strings before comparing
      if (String(data.user_id) !== String(user_id)) {
        return new Response(
          JSON.stringify({ error: "Not authorized to update this workout" }),
          { status: 403, headers: corsHeaders }
        );
      }

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
      const url = new URL(req.url);
      const pathParts = url.pathname.split("/");
      const id = pathParts[pathParts.length - 1];
      const userId = url.searchParams.get("user_id");

      if (!userId) {
        return new Response(JSON.stringify({ error: "user_id is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const { data, error: fetchError } = await supabase
        .from("workouts")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (String(data.user_id) !== String(userId)) {
        return new Response(
          JSON.stringify({ error: "Not authorized to delete this workout" }),
          { status: 403, headers: corsHeaders }
        );
      }

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
