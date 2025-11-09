import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

interface SavedAd {
  id: string;
  brand: string;
  platform: string;
  ad_text: string;
  cta: string;
  img_url: string | null;
  analysis: string;
  variations: Json;
  created_at: string;
}

export default function Saved() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadSavedAds();
    }
  }, [user]);

  const loadSavedAds = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('saved_ads')
        .select('*')
        .eq('user_id', user.id);

      if (platformFilter !== "all") {
        query = query.eq('platform', platformFilter);
      }

      const orderBy = sortBy === "date" ? "created_at" : "brand";
      const ascending = sortBy === "brand";

      query = query.order(orderBy, { ascending });

      const { data, error } = await query;

      if (error) throw error;

      setSavedAds(data || []);
    } catch (error) {
      console.error("Error loading saved ads:", error);
      toast.error("Failed to load saved ads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedAds();
  }, [platformFilter, sortBy]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_ads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedAds(savedAds.filter(ad => ad.id !== id));
      toast.success("Ad deleted");
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Failed to delete ad");
    }
  };

  const exportToPDF = (ad: SavedAd) => {
    // Create a formatted text version for download
    const content = `
AD ANALYSIS REPORT
==================

Brand: ${ad.brand}
Platform: ${ad.platform}
Date: ${new Date(ad.created_at).toLocaleDateString()}

AD COPY:
${ad.ad_text}

CTA: ${ad.cta}

ANALYSIS:
${ad.analysis}

GENERATED VARIATIONS:
${Array.isArray(ad.variations) ? (ad.variations as string[]).map((v, i) => `${i + 1}. ${v}`).join('\n\n') : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ad.brand}-ad-analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Saved Analyses</h1>
              <p className="text-muted-foreground">Your collection of analyzed ads</p>
            </div>
            
            <div className="flex gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Meta">Meta</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="brand">Brand A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {savedAds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {platformFilter !== "all" 
                    ? `No ${platformFilter} ads saved yet.` 
                    : "No saved ads yet. Start analyzing ads to build your collection!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {savedAds.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="md:flex">
                    {ad.img_url && (
                      <img src={ad.img_url} alt={ad.brand} className="md:w-64 h-48 md:h-auto object-cover" />
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {ad.brand}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-normal text-muted-foreground">{ad.platform}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => exportToPDF(ad)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(ad.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>{ad.ad_text}</CardDescription>
                        <p className="text-xs text-muted-foreground">
                          Saved on {new Date(ad.created_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Analysis</h4>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{ad.analysis}</p>
                        </div>
                        
                        {ad.variations && Array.isArray(ad.variations) && ad.variations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Variations</h4>
                            <div className="space-y-2">
                              {(ad.variations as string[]).map((variation, index) => (
                                <div key={index} className="text-sm bg-muted p-3 rounded-lg">
                                  <p className="font-medium text-xs text-muted-foreground mb-1">Variation {index + 1}</p>
                                  <p className="text-foreground/90">{variation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
