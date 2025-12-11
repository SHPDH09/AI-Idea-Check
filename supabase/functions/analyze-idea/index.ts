import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert startup consultant. Analyze the given startup idea and return a JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.
Rules:
- Keep answers concise and realistic.
- 'problem' = 1-2 sentence description of the problem being solved
- 'customer' = target customer segment description
- 'market' = market size and opportunity analysis
- 'competitor' = array of exactly 3 items (1-line differentiation each).
- 'tech_stack' = 4-6 practical technologies as an array.
- 'profitability_score' = integer 0-100.
- 'risk_level' = Low/Medium/High.
- 'justification' = 2-3 sentence explanation of the overall assessment
Return ONLY valid JSON, no markdown formatting.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaId, title, description } = await req.json();
    
    console.log(`Analyzing idea: ${ideaId} - ${title}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to analyzing
    await supabase
      .from("ideas")
      .update({ status: "analyzing" })
      .eq("id", ideaId);

    const userPrompt = `Input: {"title": "${title}", "description": "${description}"}`;

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        await supabase
          .from("ideas")
          .update({ status: "failed" })
          .eq("id", ideaId);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        await supabase
          .from("ideas")
          .update({ status: "failed" })
          .eq("id", ideaId);
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received:", content);

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response (remove any markdown code blocks if present)
    const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const aiReport = JSON.parse(cleanedContent);

    console.log("Parsed AI report:", aiReport);

    // Update the idea with the AI report
    const { error: updateError } = await supabase
      .from("ideas")
      .update({ 
        ai_report: aiReport,
        status: "completed"
      })
      .eq("id", ideaId);

    if (updateError) {
      console.error("Error updating idea:", updateError);
      throw updateError;
    }

    console.log("Successfully updated idea with AI report");

    return new Response(
      JSON.stringify({ success: true, report: aiReport }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-idea function:", error);
    
    // Try to update status to failed if we have the ideaId
    try {
      const { ideaId } = await req.clone().json();
      if (ideaId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("ideas")
          .update({ status: "failed" })
          .eq("id", ideaId);
      }
    } catch {}

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
