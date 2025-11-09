import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles, Loader2, Save } from "lucide-react";
import { searchAds, type AdData } from "@/lib/mockAds";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdData[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdData | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [variations, setVariations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    const results = searchAds(searchQuery);
    setSearchResults(results);
    setSelectedAd(null);
    setAnalysis("");
    setVariations([]);
    
    if (results.length === 0) {
      toast.info("No ads found for this brand");
    }
  };

  const handleAnalyze = async (ad: AdData) => {
    setSelectedAd(ad);
    setIsAnalyzing(true);
    setAnalysis("");
    setVariations([]);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-ad', {
        body: { ad }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      setVariations(data.variations);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing ad:", error);
      toast.error("Failed to analyze ad. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!selectedAd || !analysis) {
      toast.error("No analysis to save");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_ads').insert({
        brand: selectedAd.brand,
        platform: selectedAd.platform,
        ad_text: selectedAd.ad_text,
        cta: selectedAd.cta,
        img_url: selectedAd.img_url,
        analysis: analysis,
        variations: variations
      });

      if (error) throw error;

      toast.success("Ad analysis saved!");
    } catch (error) {
      console.error("Error saving ad:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Ad Dashboard</h1>
          <p className="text-muted-foreground mb-8">Search for SaaS brands and analyze their ad strategies</p>

          <div className="flex gap-2 mb-8">
            <Input
              placeholder="Enter brand name (e.g., Notion, Slack, Figma)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {searchResults.map((ad, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAnalyze(ad)}>
                  <img src={ad.img_url} alt={ad.brand} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {ad.brand}
                      <span className="text-xs font-normal text-muted-foreground">{ad.platform}</span>
                    </CardTitle>
                    <CardDescription>{ad.ad_text}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); handleAnalyze(ad); }}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedAd && (
            <Card className="border-2 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  AI Analysis: {selectedAd.brand}
                  {analysis && (
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Analyzing ad with AI...</span>
                  </div>
                ) : (
                  <>
                    {analysis && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Ad Analysis</h3>
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{analysis}</p>
                      </div>
                    )}

                    {variations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Generated Variations</h3>
                        <div className="space-y-3">
                          {variations.map((variation, index) => (
                            <Card key={index}>
                              <CardContent className="pt-4">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Variation {index + 1}</p>
                                <p className="text-foreground/90">{variation}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
