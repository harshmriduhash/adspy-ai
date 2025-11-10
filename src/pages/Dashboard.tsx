import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Sparkles, Loader2, Save, GitCompare } from "lucide-react";
import { searchAds, type AdData } from "@/lib/mockAds";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdData[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdData | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [variations, setVariations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<AdData[]>([]);
  const [comparison, setComparison] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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
    if (!selectedAd || !analysis || !user) {
      toast.error("No analysis to save");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_ads').insert({
        user_id: user.id,
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

  const toggleAdForComparison = (ad: AdData) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(a => a.brand === ad.brand && a.ad_text === ad.ad_text);
      if (isSelected) {
        return prev.filter(a => !(a.brand === ad.brand && a.ad_text === ad.ad_text));
      } else {
        if (prev.length >= 3) {
          toast.error("You can compare up to 3 ads at a time");
          return prev;
        }
        return [...prev, ad];
      }
    });
  };

  const handleCompare = async () => {
    if (selectedForComparison.length < 2) {
      toast.error("Please select at least 2 ads to compare");
      return;
    }

    setIsComparing(true);
    setComparison("");
    setSelectedAd(null);

    try {
      const { data, error } = await supabase.functions.invoke('compare-ads', {
        body: { ads: selectedForComparison }
      });

      if (error) throw error;

      setComparison(data.comparison);
      toast.success("Comparison complete!");
    } catch (error) {
      console.error("Error comparing ads:", error);
      toast.error("Failed to compare ads. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3 gradient-text">Ads Dashboard</h1>
            <p className="text-muted-foreground text-lg">Search for SaaS brands & analyze their ad strategies</p>
          </div>

          <div className="flex gap-2 mb-8">
            <Input
              placeholder="Enter brand name (e.g., Notion, Slack, Figma)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-card/50 backdrop-blur-sm border-border/50"
            />
            <Button onClick={handleSearch} className="shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {selectedForComparison.length > 0 && (
            <div className="mb-6 p-4 rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-accent" />
                  <span className="font-medium">
                    {selectedForComparison.length} ad{selectedForComparison.length > 1 ? 's' : ''} selected for comparison
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForComparison([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCompare}
                    disabled={selectedForComparison.length < 2}
                    className="shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {searchResults.map((ad, index) => {
                const isSelected = selectedForComparison.some(a => a.brand === ad.brand && a.ad_text === ad.ad_text);
                return (
                  <Card
                    key={index}
                    className={`overflow-hidden card-hover cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 ${isSelected ? 'ring-2 ring-accent shadow-[0_0_30px_rgba(6,182,212,0.4)]' : ''
                      }`}
                  >
                    <div className="relative">
                      <img src={ad.img_url} alt={ad.brand} className="w-full h-48 object-cover" />
                      <div
                        className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg p-2 cursor-pointer hover:bg-background transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAdForComparison(ad);
                        }}
                      >
                        <Checkbox checked={isSelected} />
                      </div>
                      {isSelected && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <CardHeader onClick={() => handleAnalyze(ad)}>
                      <CardTitle className="flex items-center justify-between">
                        {ad.brand}
                        <Badge variant="outline">{ad.platform}</Badge>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{ad.ad_text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        className="w-full shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        onClick={(e) => { e.stopPropagation(); handleAnalyze(ad); }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze with AI
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {comparison && (
            <Card className="mb-8 border-2 border-accent/30 bg-card/50 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-accent" />
                  AI Comparison Analysis
                </CardTitle>
                <CardDescription>Comparing {selectedForComparison.length} ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{comparison}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {isComparing && (
            <Card className="mb-8 border-2 border-accent/30 bg-card/50 backdrop-blur-xl">
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <span className="ml-3 text-muted-foreground">Comparing ads with AI...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedAd && (
            <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.2)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Analysis: {selectedAd.brand}
                  </span>
                  {analysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    >
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
                      <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <span className="w-1 h-6 bg-primary rounded-full"></span>
                          Ad Analysis
                        </h3>
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{analysis}</p>
                      </div>
                    )}

                    {variations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <span className="w-1 h-6 bg-accent rounded-full"></span>
                          Generated Variations
                        </h3>
                        <div className="space-y-4">
                          {variations.map((variation, index) => (
                            <Card key={index} className="bg-muted/30 border-border/50 card-hover">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Variation {index + 1}</Badge>
                                </div>
                                <p className="text-foreground/90 leading-relaxed">{variation}</p>
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
