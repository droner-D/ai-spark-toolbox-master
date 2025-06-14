
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWithOpenAI } from '@/services/openaiService';
import { Copy, Download, Loader2 } from 'lucide-react';

const CommunicationGenerator = () => {
  const [contentType, setContentType] = React.useState('meeting-agenda');
  const [tone, setTone] = React.useState('professional');
  const [style, setStyle] = React.useState('formal');
  const [subject, setSubject] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [customInstructions, setCustomInstructions] = React.useState('');
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) return;

    setIsGenerating(true);
    try {
      let prompt = '';
      
      if (contentType === 'meeting-agenda') {
        prompt = `Create a professional meeting agenda for: ${subject}
        
Details: ${details}
Tone: ${tone}
Style: ${style}
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Please create a well-structured meeting agenda with time slots, topics, and clear objectives.`;
      } else if (contentType === 'meeting-description') {
        prompt = `Create a meeting description/invitation for: ${subject}
        
Details: ${details}
Tone: ${tone}
Style: ${style}
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Please create a clear and informative meeting description that would work well in calendar invitations.`;
      } else if (contentType === 'slack-message') {
        prompt = `Create a Slack message about: ${subject}
        
Details: ${details}
Tone: ${tone}
Style: ${style}
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Please create an appropriate Slack message that fits the tone and style requested.`;
      }

      const result = await generateWithOpenAI({ prompt });
      setGeneratedContent(result);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Communication Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="comment-gradient text-transparent bg-clip-text">
              Generate Communication Content
            </CardTitle>
            <CardDescription>
              Create meeting agendas, descriptions, and Slack messages with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting-agenda">Meeting Agenda</SelectItem>
                  <SelectItem value="meeting-description">Meeting Description</SelectItem>
                  <SelectItem value="slack-message">Slack Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="bullet-points">Bullet Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject/Topic *</Label>
              <Input
                id="subject"
                placeholder="Enter the main subject or topic"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details/Context</Label>
              <Textarea
                id="details"
                placeholder="Provide additional details, context, or key points to include"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customInstructions">Custom Instructions</Label>
              <Textarea
                id="customInstructions"
                placeholder="Any specific requirements or custom instructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!subject.trim() || isGenerating}
              className="w-full toolbox-btn-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Your AI-generated communication content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedContent}
                  </pre>
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
              <div className="text-center text-muted-foreground py-8">
                <p>Generated content will appear here after you click "Generate Content"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunicationGenerator;
