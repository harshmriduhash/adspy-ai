-- Create saved_ads table for storing analyzed ad results
CREATE TABLE public.saved_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  platform TEXT NOT NULL,
  ad_text TEXT NOT NULL,
  cta TEXT NOT NULL,
  img_url TEXT,
  analysis TEXT NOT NULL,
  variations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_ads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read saved ads (public data)
CREATE POLICY "Anyone can view saved ads" 
ON public.saved_ads 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert saved ads
CREATE POLICY "Anyone can create saved ads" 
ON public.saved_ads 
FOR INSERT 
WITH CHECK (true);

-- Create index on brand for better search performance
CREATE INDEX idx_saved_ads_brand ON public.saved_ads(brand);

-- Create index on created_at for sorting
CREATE INDEX idx_saved_ads_created_at ON public.saved_ads(created_at DESC);