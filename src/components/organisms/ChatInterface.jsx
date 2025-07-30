import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "@/components/molecules/ChatMessage";
import TypingIndicator from "@/components/molecules/TypingIndicator";
import ScanProgress from "@/components/molecules/ScanProgress";
import Card from "@/components/atoms/Card";

const ChatInterface = ({ onStartScan, scanResult, isScanning, scanProgress, onShowReview, onRemoveAll, onSkip }) => {
  const [messages, setMessages] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: "welcome",
      content: "Hi there! I'm LinkKeeper, your bookmark cleaning assistant. I can help you find and remove duplicate bookmarks and dead links. Ready to get started?",
      isBot: true,
      actions: [{
        label: "Start Scan",
        onClick: handleStartScan,
        icon: "Search"
      }]
    }]);
  }, []);

  useEffect(() => {
    if (scanResult && !isScanning) {
      const { duplicates, deadLinks, totalScanned } = scanResult;
      const duplicateCount = duplicates.length;
      const deadCount = deadLinks.length;
      
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        
        let message = "";
        let actions = [];

        if (duplicateCount === 0 && deadCount === 0) {
          message = `Great news! I scanned ${totalScanned} bookmarks and everything looks clean. No duplicates or dead links found. Your bookmarks are well-organized! 🎉`;
          actions = [{
            label: "Scan Again",
            onClick: handleStartScan,
            icon: "RefreshCw",
            variant: "secondary"
          }];
        } else {
          message = `I found ${duplicateCount} duplicate${duplicateCount !== 1 ? "s" : ""} and ${deadCount} dead link${deadCount !== 1 ? "s" : ""} in your ${totalScanned} bookmarks. Want me to remove them? You can also review the list first.`;
          actions = [];
          
          if (duplicateCount > 0 || deadCount > 0) {
            actions.push({
              label: "Remove All",
              onClick: handleRemoveAll,
              icon: "Trash2",
              variant: "danger"
            });
            actions.push({
              label: "Review List",
              onClick: handleShowReview,
              icon: "Eye"
            });
          }
          
          actions.push({
            label: "Skip for Now",
            onClick: handleSkip,
            icon: "X",
            variant: "secondary"
          });
        }

        const newMessage = {
          id: `result-${Date.now()}`,
          content: message,
          isBot: true,
          actions
        };

        setMessages(prev => [...prev, newMessage]);
      }, 1500);
    }
  }, [scanResult, isScanning]);

  const handleStartScan = () => {
    const userMessage = {
      id: `user-${Date.now()}`,
      content: "Start scanning my bookmarks",
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        const botMessage = {
          id: `bot-${Date.now()}`,
          content: "Perfect! I'll scan all your bookmarks to find duplicates and dead links. This might take a few moments...",
          isBot: true
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }, 500);

    onStartScan();
  };

  const handleShowReview = () => {
    const userMessage = {
      id: `user-${Date.now()}`,
      content: "Show me the review list",
      isBot: false
    };
    setMessages(prev => [...prev, userMessage]);
    onShowReview();
  };

  const handleRemoveAll = () => {
    const userMessage = {
      id: `user-${Date.now()}`,
      content: "Remove all duplicates and dead links",
      isBot: false
    };
    setMessages(prev => [...prev, userMessage]);
    onRemoveAll();
  };

  const handleSkip = () => {
    const userMessage = {
      id: `user-${Date.now()}`,
      content: "Skip for now",
      isBot: false
    };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botMessage = {
        id: `bot-${Date.now()}`,
        content: "No problem! Your bookmarks will stay as they are. Feel free to run another scan anytime you want to clean things up.",
        isBot: true,
        actions: [{
          label: "Scan Again",
          onClick: handleStartScan,
          icon: "RefreshCw"
        }]
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
    
    onSkip();
  };

  return (
    <Card className="flex flex-col h-[600px] bg-gradient-to-br from-white to-slate-50">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">LK</span>
          </div>
          <span>LinkKeeper Assistant</span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
<AnimatePresence>
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isBot={message.isBot}
              actions={message.actions || []}
            />
          ))}
          
          {showTyping && <TypingIndicator key="typing-indicator" />}
          
          {isScanning && scanProgress && (
            <motion.div
              key="scan-progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ScanProgress {...scanProgress} />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};

export default ChatInterface;