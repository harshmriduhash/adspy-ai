import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ad } = await req.json();
    
    if (!ad) {
      return new Response(
        JSON.stringify({ error: 'Ad data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze the ad
    const analysisPrompt = `Analyze this SaaS advertisement:
    
Brand: ${ad.brand}
Platform: ${ad.platform}
Ad Text: ${ad.ad_text}
CTA: ${ad.cta}

Provide a detailed analysis covering:
1. Emotional tone and psychological triggers
2. The key hook and value proposition
3. Why this ad is effective for the target audience
4. Specific techniques used (urgency, social proof, benefits, etc.)

Keep the analysis concise but insightful (150-200 words).`;

    console.log('Sending analysis request to OpenAI...');
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert in SaaS marketing and advertising psychology. Provide clear, actionable insights.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI analysis error:', analysisResponse.status, errorText);
      throw new Error(`OpenAI API error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const analysis = analysisData.choices[0].message.content;

    // Generate 3 variations
    const variationsPrompt = `Based on this successful ad, create 3 new ad copy variations that use similar techniques but with different angles:

Original Ad:
${ad.ad_text}

Generate 3 variations that:
- Keep the same tone and emotional appeal
- Use different hooks or value propositions
- Are suitable for ${ad.platform}
- Include a strong CTA

Format: Return ONLY the 3 ad copies, numbered 1-3, with each variation on a new line. Each variation should be 1-2 sentences max.`;

    console.log('Generating variations...');
    const variationsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert copywriter specializing in SaaS advertising. Create compelling, concise ad variations.' 
          },
          { role: 'user', content: variationsPrompt }
        ],
        max_completion_tokens: 400,
      }),
    });

    if (!variationsResponse.ok) {
      const errorText = await variationsResponse.text();
      console.error('OpenAI variations error:', variationsResponse.status, errorText);
      throw new Error(`OpenAI API error: ${variationsResponse.status}`);
    }

    const variationsData = await variationsResponse.json();
    const variationsText = variationsData.choices[0].message.content;
    
    // Parse the variations (split by numbered lines)
    const variations = variationsText
      .split(/\d+\.\s+/)
      .filter((v: string) => v.trim().length > 0)
      .map((v: string) => v.trim())
      .slice(0, 3);

    console.log('Analysis complete, returning results');
    return new Response(
      JSON.stringify({ 
        analysis,
        variations 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-ad function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
