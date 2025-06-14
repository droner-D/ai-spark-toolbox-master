
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateWithOpenAI } from "@/services/openaiService";
import { FileText, Copy, Download } from "lucide-react";

const JiraTicketGenerator = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedTicket, setGeneratedTicket] = React.useState('');
  const [formData, setFormData] = React.useState({
    ticketType: 'User Story',
    title: '',
    description: '',
    priority: 'Medium',
    component: '',
    labels: '',
    storyPoints: '',
    customInstructions: ''
  });

  const { toast } = useToast();

  const ticketTypes = [
    'User Story',
    'Task',
    'Bug',
    'Epic',
    'Sub-task',
    'Improvement'
  ];

  const priorities = [
    'Highest',
    'High', 
    'Medium',
    'Low',
    'Lowest'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTicket = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title for the ticket.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Create a professional Jira ticket with the following details:
      
Ticket Type: ${formData.ticketType}
Title: ${formData.title}
Description: ${formData.description}
Priority: ${formData.priority}
Component: ${formData.component}
Labels: ${formData.labels}
Story Points: ${formData.storyPoints}

Additional Instructions: ${formData.customInstructions}

Please format this as a complete Jira ticket with proper structure, acceptance criteria (if applicable), and all relevant fields. Make it professional and detailed.`;

      const result = await generateWithOpenAI({
        prompt: `jira ticket: ${prompt}`,
        model: 'gpt-4.1-2025-04-14'
      });

      setGeneratedTicket(result);
      
      toast({
        title: "Ticket Generated!",
        description: "Your Jira ticket has been created successfully."
      });
    } catch (error) {
      console.error('Error generating ticket:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTicket);
      toast({
        title: "Copied!",
        description: "Ticket copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadTicket = () => {
    const blob = new Blob([generatedTicket], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jira-ticket-${formData.ticketType.toLowerCase().replace(' ', '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Ticket saved to your downloads folder."
    });
  };

  const clearForm = () => {
    setFormData({
      ticketType: 'User Story',
      title: '',
      description: '',
      priority: 'Medium',
      component: '',
      labels: '',
      storyPoints: '',
      customInstructions: ''
    });
    setGeneratedTicket('');
  };

  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Jira Ticket Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="jira-gradient text-transparent bg-clip-text">Create Jira Ticket</CardTitle>
            <CardDescription>
              Generate professional Jira tickets with all required fields and proper formatting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ticketType">Ticket Type</Label>
                <select
                  id="ticketType"
                  value={formData.ticketType}
                  onChange={(e) => handleInputChange('ticketType', e.target.value)}
                  className="toolbox-input mt-1"
                >
                  {ticketTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="toolbox-input mt-1"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief, descriptive title for the ticket"
                className="toolbox-input mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the requirement, bug, or task"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="component">Component</Label>
                <input
                  id="component"
                  type="text"
                  value={formData.component}
                  onChange={(e) => handleInputChange('component', e.target.value)}
                  placeholder="e.g., Frontend, Backend, API"
                  className="toolbox-input mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="storyPoints">Story Points</Label>
                <input
                  id="storyPoints"
                  type="text"
                  value={formData.storyPoints}
                  onChange={(e) => handleInputChange('storyPoints', e.target.value)}
                  placeholder="e.g., 1, 2, 3, 5, 8"
                  className="toolbox-input mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="labels">Labels</Label>
              <input
                id="labels"
                type="text"
                value={formData.labels}
                onChange={(e) => handleInputChange('labels', e.target.value)}
                placeholder="Comma-separated labels (e.g., ui, backend, urgent)"
                className="toolbox-input mt-1"
              />
            </div>

            <div>
              <Label htmlFor="customInstructions">Additional Instructions</Label>
              <Textarea
                id="customInstructions"
                value={formData.customInstructions}
                onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                placeholder="Any specific requirements, context, or formatting preferences"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={generateTicket} 
                disabled={isGenerating}
                className="toolbox-btn-primary flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Ticket'}
              </Button>
              
              <Button 
                onClick={clearForm} 
                variant="outline"
                className="toolbox-btn-outline"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Ticket</CardTitle>
            <CardDescription>
              Your professional Jira ticket will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTicket ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedTicket}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="toolbox-btn-outline flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  
                  <Button 
                    onClick={downloadTicket}
                    variant="outline"
                    className="toolbox-btn-outline flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Fill out the form and click "Generate Ticket" to create your Jira ticket</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JiraTicketGenerator;
