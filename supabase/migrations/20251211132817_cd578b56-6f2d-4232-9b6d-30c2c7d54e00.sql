-- Create ideas table to store startup ideas and AI reports
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ai_report JSONB DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for this demo app)
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this validator tool)
CREATE POLICY "Anyone can view ideas" 
ON public.ideas 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create ideas" 
ON public.ideas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update ideas" 
ON public.ideas 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete ideas" 
ON public.ideas 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();