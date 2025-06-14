
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommentGenerator = () => {
  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Comment Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle className="comment-gradient text-transparent bg-clip-text">Coming Soon!</CardTitle>
          <CardDescription>
            This tool will help you create engaging comments for social media platforms
            like LinkedIn, X, YouTube, and Instagram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Features will include:
            </p>
            <ul className="mt-4 text-left list-disc list-inside">
              <li className="mb-2">Platform-specific comment formatting</li>
              <li className="mb-2">Multiple tone options (professional, casual, enthusiastic, etc.)</li>
              <li className="mb-2">Custom context input</li>
              <li className="mb-2">Length options for different platforms</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentGenerator;
