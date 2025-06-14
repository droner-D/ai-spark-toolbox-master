
import * as React from 'react';
import Sidebar from './Sidebar';
import YouTubeSummary from './YouTubeSummary';
import SocialMediaGenerator from './SocialMediaGenerator';
import CommentGenerator from './CommentGenerator';
import JiraTicketGenerator from './JiraTicketGenerator';

const AIToolbox = () => {
  const [activeTool, setActiveTool] = React.useState('youtube-summary');
  
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'youtube-summary':
        return <YouTubeSummary />;
      case 'social-media':
        return <SocialMediaGenerator />;
      case 'comments':
        return <CommentGenerator />;
      case 'jira-tickets':
        return <JiraTicketGenerator />;
      default:
        return <YouTubeSummary />;
    }
  };
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 overflow-y-auto">
        {renderActiveTool()}
      </main>
    </div>
  );
};

export default AIToolbox;
