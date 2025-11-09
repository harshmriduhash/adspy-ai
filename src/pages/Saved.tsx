import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedAds();
  }, []);

  const loadSavedAds = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedAds(data || []);
    } catch (error) {
      console.error("Error loading saved ads:", error);
      toast.error("Failed to load saved ads");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Saved Analyses</h1>
          <p className="text-muted-foreground mb-8">Your collection of analyzed ads</p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : savedAds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No saved ads yet. Start analyzing ads to build your collection!</p>
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
                          <span className="text-xs font-normal text-muted-foreground">{ad.platform}</span>
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
