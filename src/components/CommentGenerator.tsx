
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, MessageSquare, Loader2 } from "lucide-react";
import { generateWithOpenAI } from "@/services/openaiService";
import { toast } from "sonner";

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
  { id: 'x', name: 'X (Twitter)', color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-700' }
];

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-appropriate' },
  { id: 'casual', name: 'Casual', description: 'Friendly and conversational' },
  { id: 'enthusiastic', name: 'Enthusiastic', description: 'Excited and energetic' },
  { id: 'supportive', name: 'Supportive', description: 'Encouraging and positive' },
  { id: 'questioning', name: 'Questioning', description: 'Curious and thought-provoking' },
  { id: 'humorous', name: 'Humorous', description: 'Light-hearted and funny' }
];

const CommentGenerator = () => {
  const [platform, setPlatform] = React.useState('linkedin');
  const [tone, setTone] = React.useState('professional');
  const [postContent, setPostContent] = React.useState('');
  const [customInstructions, setCustomInstructions] = React.useState('');
  const [generatedComment, setGeneratedComment] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!postContent.trim()) {
      toast.error('Please provide the post content to comment on');
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedPlatform = platforms.find(p => p.id === platform);
      const selectedTone = tones.find(t => t.id === tone);
      
      const prompt = `Generate a thoughtful comment for a ${selectedPlatform?.name} post with a ${selectedTone?.name.toLowerCase()} tone.

Post Content: "${postContent}"

Platform: ${selectedPlatform?.name}
Tone: ${selectedTone?.name} - ${selectedTone?.description}
${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}

Guidelines:
- Keep the comment engaging and relevant to the post
- Match the ${selectedTone?.name.toLowerCase()} tone throughout
- Make it platform-appropriate for ${selectedPlatform?.name}
- Add value to the conversation
- Be authentic and genuine
${platform === 'linkedin' ? '- Include professional insights or experiences' : ''}
${platform === 'x' ? '- Keep it concise and impactful' : ''}
${platform === 'youtube' ? '- Reference the video content if applicable' : ''}
${platform === 'instagram' ? '- Include relevant emojis if appropriate' : ''}

Generate only the comment text, no additional formatting or quotes.`;

      const result = await generateWithOpenAI({
        prompt: 'comment',
        context: prompt
      });
      
      setGeneratedComment(result);
      toast.success('Comment generated successfully!');
    } catch (error) {
      console.error('Error generating comment:', error);
      toast.error('Failed to generate comment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedComment);
      toast.success('Comment copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy comment');
    }
  };

  const handleExport = () => {
    const selectedPlatform = platforms.find(p => p.id === platform);
    const selectedTone = tones.find(t => t.id === tone);
    
    const exportContent = `Comment for ${selectedPlatform?.name}
Generated on: ${new Date().toLocaleDateString()}
Tone: ${selectedTone?.name}
Platform: ${selectedPlatform?.name}

Original Post Content:
${postContent}

Generated Comment:
${generatedComment}

${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}`;

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comment-${platform}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Comment exported successfully!');
  };

  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Comment Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="comment-gradient text-transparent bg-clip-text flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-toolbox-green" />
              Generate Comments
            </CardTitle>
            <CardDescription>
              Create engaging comments for social media posts with different tones and styles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Platform</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Badge
                    key={p.id}
                    variant={platform === p.id ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      platform === p.id ? p.color + ' text-white' : ''
                    }`}
                    onClick={() => setPlatform(p.id)}
                  >
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Comment Tone</Label>
              <RadioGroup value={tone} onValueChange={setTone} className="space-y-2">
                {tones.map((t) => (
                  <div key={t.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={t.id} id={t.id} />
                    <Label htmlFor={t.id} className="cursor-pointer">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">- {t.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Post Content Input */}
            <div className="space-y-2">
              <Label htmlFor="postContent" className="text-base font-medium">
                Post Content to Comment On *
              </Label>
              <Textarea
                id="postContent"
                placeholder="Paste the post content you want to comment on..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <Label htmlFor="customInstructions" className="text-base font-medium">
                Custom Instructions (Optional)
              </Label>
              <Textarea
                id="customInstructions"
                placeholder="Any specific requirements or context for the comment..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !postContent.trim()}
              className="w-full toolbox-btn-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Comment...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Comment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Comment</CardTitle>
            <CardDescription>
              Your AI-generated comment will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedComment ? (
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedComment}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Your generated comment will appear here</p>
                <p className="text-sm mt-2">Fill in the post content and click generate to start</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommentGenerator;
