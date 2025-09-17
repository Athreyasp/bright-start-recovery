import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X, Send, RotateCcw, Trash2, Copy, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ChatMessage { 
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  id: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI recovery assistant. I\'m here to support you 24/7. How can I help you today?',
      timestamp: new Date(),
      id: 'welcome'
    }
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  // Quick action buttons for common questions
  const quickActions = [
    { text: "How can I manage cravings?", emoji: "🧠" },
    { text: "Tell me about support groups", emoji: "👥" },
    { text: "What are healthy coping strategies?", emoji: "💪" },
    { text: "Help me set recovery goals", emoji: "🎯" }
  ]

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const generateMessageId = () => Math.random().toString(36).substring(2, 15)

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({ title: "Message copied to clipboard", duration: 2000 })
    } catch (error) {
      toast({ title: "Failed to copy message", variant: "destructive", duration: 2000 })
    }
  }

  const clearConversation = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hi! I\'m your AI recovery assistant. I\'m here to support you 24/7. How can I help you today?',
      timestamp: new Date(),
      id: 'welcome'
    }])
    toast({ title: "Conversation cleared", duration: 2000 })
  }

  const handleQuickAction = (questionText: string) => {
    setInput(questionText)
    sendMessage(questionText)
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || loading) return
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
      id: generateMessageId()
    }
    
    const newMessages: ChatMessage[] = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setRetryCount(0)

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', { 
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) }
      })
      
      if (error) throw error
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        id: generateMessageId()
      }
      
      setMessages([...newMessages, assistantMessage])
      
    } catch (error: any) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment. If the issue persists, you can always reach out to our support team.',
        timestamp: new Date(),
        id: generateMessageId()
      }
      
      setMessages([...newMessages, errorMessage])
      
      toast({
        title: "Connection Error",
        description: "There was an issue sending your message. Please try again.",
        variant: "destructive",
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const retryLastMessage = async () => {
    if (messages.length < 2 || retryCount >= 3) return
    
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return
    
    setRetryCount(prev => prev + 1)
    
    // Remove the last assistant message and retry
    const messagesWithoutLast = messages.slice(0, -1)
    setMessages(messagesWithoutLast)
    
    await sendMessage(lastUserMessage.content)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {/* Enhanced Launcher with notification badge */}
      <button
        aria-label="Open AI Recovery Assistant"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9999] rounded-full p-4 bg-primary text-primary-foreground shadow-2xl hover:shadow-xl hover:scale-110 transform transition-all duration-300 pulse-ring group"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
        {!open && (
          <Badge className="absolute -top-2 -left-2 bg-primary text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            AI Assistant
          </Badge>
        )}
      </button>

      {/* Enhanced Panel with header actions */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[9998] w-80 sm:w-96 animate-enter">
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-xl glass-morphism max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-success/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">AI Recovery Assistant</p>
                  <p className="text-xs text-muted-foreground">Here to support your wellness journey</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearConversation}
                  className="h-8 w-8 p-0 hover:bg-destructive/20"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-3">Quick questions to get started:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.text)}
                      className="text-left h-auto py-2 px-3 text-xs whitespace-normal"
                      disabled={loading}
                    >
                      <span className="mr-1">{action.emoji}</span>
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/50 to-background/80" style={{ maxHeight: '300px' }}>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm group relative ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground shadow-primary/20' 
                        : 'bg-muted border border-border/50 text-foreground'
                    }`}>
                      {m.content}
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(m.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(m.content)}
                          className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Enhanced loading indicator */}
                {loading && (
                  <div className="text-left">
                    <div className="inline-block px-4 py-3 rounded-2xl bg-muted border border-border/50 max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">AI is crafting a thoughtful response...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={endRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
              {/* Error retry option */}
              {retryCount > 0 && retryCount < 3 && (
                <div className="mb-3 p-2 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="text-xs text-warning flex-1">Connection issue detected</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryLastMessage}
                    className="h-6 text-xs"
                    disabled={loading}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              )}
              
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? 'AI is responding...' : 'Ask me anything about your recovery journey...'}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={loading}
                  className="flex-1 border-border/50 focus-visible:ring-primary/50 bg-background/60"
                  maxLength={500}
                />
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={loading || !input.trim()} 
                  className="shrink-0 px-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="default"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Your AI assistant is here 24/7 to support you</span>
                <span>{input.length}/500</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
