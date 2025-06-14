
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { generateWithOpenAI } from "@/services/openaiService";
import { toast } from "sonner";

const SocialMediaGenerator = () => {
  const [topic, setTopic] = React.useState('');
  const [platform, setPlatform] = React.useState('');
  const [style, setStyle] = React.useState('');
  const [customInstructions, setCustomInstructions] = React.useState('');
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn', description: 'Professional networking posts' },
    { value: 'twitter', label: 'X (Twitter)', description: 'Short, engaging tweets' },
    { value: 'youtube', label: 'YouTube Story', description: 'Video descriptions and community posts' },
    { value: 'instagram', label: 'Instagram', description: 'Visual storytelling posts' },
    { value: 'facebook', label: 'Facebook', description: 'Community-focused posts' }
  ];

  const writingStyles = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivational and uplifting' },
    { value: 'educational', label: 'Educational', description: 'Informative and teaching-focused' },
    { value: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' },
    { value: 'humorous', label: 'Humorous', description: 'Light-hearted and funny' },
    { value: 'thought-provoking', label: 'Thought-Provoking', description: 'Deep and contemplative' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || !platform || !style) {
      toast.error("Please fill in topic, platform, and writing style");
      return;
    }

    setIsGenerating(true);
    try {
      const platformDetails = platforms.find(p => p.value === platform);
      const styleDetails = writingStyles.find(s => s.value === style);
      
      let prompt = `Create a ${styleDetails?.label.toLowerCase()} social media post for ${platformDetails?.label} about: ${topic}

Platform: ${platformDetails?.label} (${platformDetails?.description})
Writing Style: ${styleDetails?.label} (${styleDetails?.description})
Topic: ${topic}`;

      if (customInstructions.trim()) {
        prompt += `\n\nCustom Instructions: ${customInstructions}`;
      }

      prompt += `\n\nPlease create an engaging post that fits the platform's format and audience expectations. Include relevant hashtags and emojis where appropriate.`;

      const content = await generateWithOpenAI({ prompt });
      setGeneratedContent(content);
      toast.success("Social media post generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const handleExport = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-media-post-${platform}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Content exported successfully!");
  };

  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Social Media Post Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="social-gradient text-transparent bg-clip-text">Create Your Post</CardTitle>
            <CardDescription>
              Generate engaging social media content for different platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Content Idea *</label>
              <Textarea
                placeholder="What do you want to post about? (e.g., launching a new product, sharing industry insights, personal achievement)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform *</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.label}</span>
                        <span className="text-xs text-muted-foreground">{p.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Writing Style *</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your style" />
                </SelectTrigger>
                <SelectContent>
                  {writingStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-xs text-muted-foreground">{s.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Instructions (Optional)</label>
              <Textarea
                placeholder="Any specific requirements? (e.g., include call-to-action, mention specific keywords, target certain audience)"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic.trim() || !platform || !style}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Post'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            {platform && style && (
              <div className="flex gap-2">
                <Badge variant="secondary">{platforms.find(p => p.value === platform)?.label}</Badge>
                <Badge variant="outline">{writingStyles.find(s => s.value === style)?.label}</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg min-h-[300px] whitespace-pre-wrap">
                  {generatedContent}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={handleExport} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <Share2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Your generated social media post will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaGenerator;
