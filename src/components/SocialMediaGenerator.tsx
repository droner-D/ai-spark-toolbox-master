
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SocialMediaGenerator = () => {
  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Social Media Post Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle className="social-gradient text-transparent bg-clip-text">Coming Soon!</CardTitle>
          <CardDescription>
            This tool will allow you to generate customized social media posts for different platforms
            like LinkedIn, X, YouTube stories, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Features will include:
            </p>
            <ul className="mt-4 text-left list-disc list-inside">
              <li className="mb-2">Multiple platform formatting</li>
              <li className="mb-2">Different writing styles and tones</li>
              <li className="mb-2">Custom instruction support</li>
              <li className="mb-2">Content preview and export</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaGenerator;
