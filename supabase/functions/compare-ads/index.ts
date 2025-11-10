import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ads } = await req.json();
    
    if (!ads || ads.length < 2 || ads.length > 3) {
      return new Response(
        JSON.stringify({ error: 'Please provide 2-3 ads for comparison' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const adsDescription = ads.map((ad: any, index: number) => 
      `Ad ${index + 1} (${ad.brand} - ${ad.platform}):
Text: "${ad.ad_text}"
CTA: "${ad.cta}"`
    ).join('\n\n');

    const prompt = `Compare the following ${ads.length} ads and provide a detailed analysis:

${adsDescription}

Provide a comprehensive comparison covering:
1. **Overall Effectiveness Ranking**: Rank the ads from most to least effective
2. **Key Strengths**: What each ad does well
3. **Weaknesses**: Areas where each ad could improve
4. **Messaging Strategy**: Compare the approaches (emotional vs. rational, feature-focused vs. benefit-focused)
5. **Target Audience**: Who each ad appeals to most
6. **Best Practices Identified**: What strategies work best across these ads
7. **Recommendations**: Which elements should be adopted or avoided in future ads

Be specific and actionable in your analysis.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert advertising analyst specializing in SaaS marketing. Provide detailed, actionable comparisons.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const comparison = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ comparison }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in compare-ads function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
