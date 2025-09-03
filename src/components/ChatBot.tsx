import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bot, Send, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client'

const ChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI recovery assistant. How are you feeling today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    // Simple AI responses (in production, this would call a real AI service)
    const responses = [
      "That's understandable. Recovery is a journey with ups and downs. What's one small thing you can do for yourself right now?",
      "I hear you. Remember, every day you choose recovery is a victory. Have you tried any coping strategies today?",
      "Thank you for sharing that with me. It takes courage to be honest about how you're feeling. What support do you need right now?",
      "That sounds challenging. Would it help to talk about what triggered these feelings?",
      "You're doing great by reaching out. Remember your support network is here for you. Have you considered calling your sponsor or therapist?"
    ];

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    // Save to database
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: input,
        is_user: true
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setInput("");
  };

  return (
    <div className="min-h-screen bg-background font-poppins p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-6 h-6 mr-2 text-primary" />
              AI Recovery Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.isBot ? <Bot className="w-4 h-4 mt-1" /> : <User className="w-4 h-4 mt-1" />}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;