
import * as React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getYouTubeTranscript, generateWithOpenAI } from "@/services/openaiService";
import { Download, Loader2 } from 'lucide-react';

const YouTubeSummary = () => {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = React.useState("");
  const [language, setLanguage] = React.useState("english");
  const [transcript, setTranscript] = React.useState("");
  const [outputType, setOutputType] = React.useState("summary");
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const handleGetTranscript = async () => {
    if (!videoUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const transcriptText = await getYouTubeTranscript(videoUrl, language);
      setTranscript(transcriptText);
      toast({
        title: "Transcript Retrieved",
        description: "Successfully fetched the video transcript."
      });
    } catch (error) {
      console.error("Error fetching transcript:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve transcript. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProcessContent = async () => {
    if (!transcript) {
      toast({
        title: "Transcript Required",
        description: "Please fetch or enter a transcript first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      let prompt = "";
      switch (outputType) {
        case "summary":
          prompt = `Summarize the following transcript concisely while capturing the key points:\n\n${transcript}`;
          break;
        case "notes":
          prompt = `Create detailed notes from the following transcript, organizing by key topics and highlighting important information:\n\n${transcript}`;
          break;
        case "explanation":
          prompt = `Explain the concepts discussed in the following transcript in simple terms, as if explaining to someone with no background knowledge:\n\n${transcript}`;
          break;
        case "custom":
          prompt = `${customPrompt}\n\nTranscript:\n${transcript}`;
          break;
        default:
          prompt = `Summarize the following transcript:\n\n${transcript}`;
      }
      
      const generatedResult = await generateWithOpenAI({ prompt });
      setResult(generatedResult);
      
      toast({
        title: "Processing Complete",
        description: "Successfully processed the transcript."
      });
    } catch (error) {
      console.error("Error processing content:", error);
      toast({
        title: "Error",
        description: "Failed to process the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExport = () => {
    if (!result) {
      toast({
        title: "No Content",
        description: "Please generate content before exporting",
        variant: "destructive"
      });
      return;
    }
    
    // Create a blob of the text content
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `youtube-${outputType}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Content exported successfully."
    });
  };
  
  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">YouTube Video Summary</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Enter a YouTube URL or paste an existing transcript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="url">YouTube URL</TabsTrigger>
              <TabsTrigger value="paste">Paste Transcript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="youtube-url">YouTube Video URL</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleGetTranscript} 
                      disabled={isLoading}
                      className="youtube-gradient"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spinner" />}
                      Get Transcript
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={language} 
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger id="language" className="mt-1.5">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="paste">
              <div className="space-y-2">
                <Label htmlFor="transcript">Paste Transcript</Label>
                <Textarea
                  id="transcript"
                  placeholder="Paste the video transcript here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={8}
                  className="resize-y"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Processing Options</CardTitle>
          <CardDescription>
            Select what you want to do with the transcript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="output-type">Output Type</Label>
              <Select 
                value={outputType} 
                onValueChange={setOutputType}
              >
                <SelectTrigger id="output-type" className="mt-1.5">
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="notes">Detailed Notes</SelectItem>
                  <SelectItem value="explanation">Simple Explanation</SelectItem>
                  <SelectItem value="custom">Custom Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {outputType === "custom" && (
              <div>
                <Label htmlFor="custom-prompt">Custom Instructions</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Enter your custom instructions here..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            )}
            
            <Button 
              onClick={handleProcessContent}
              disabled={!transcript || isProcessing}
              className="w-full youtube-gradient"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spinner" />}
              Process Content
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>
            Your processed content will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{
                  __html: result.replace(/\n/g, "<br>")
                }}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Process content to see results here
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleExport} 
            disabled={!result}
            className="ml-auto"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default YouTubeSummary;
