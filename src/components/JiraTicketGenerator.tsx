
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const JiraTicketGenerator = () => {
  return (
    <div className="container p-4 mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Jira Ticket Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle className="jira-gradient text-transparent bg-clip-text">Coming Soon!</CardTitle>
          <CardDescription>
            This tool will help you create professional Jira tickets based on your inputs,
            with options to create EPICs, Tasks, User Stories, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Features will include:
            </p>
            <ul className="mt-4 text-left list-disc list-inside">
              <li className="mb-2">Multiple ticket type support (EPIC, Task, User Story)</li>
              <li className="mb-2">Professional formatting with all required Jira fields</li>
              <li className="mb-2">Direct integration with Jira (coming later)</li>
              <li className="mb-2">Templates for common ticket types</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraTicketGenerator;
