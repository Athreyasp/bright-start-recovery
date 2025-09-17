import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface ChatMessage { role: 'user' | 'assistant'; content: string }

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I\'m your support assistant. How can I help you today?' }
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  const send = async () => {
    if (!input.trim() || loading) return
    const newMessages: ChatMessage[] = [...messages, { role: 'user' as const, content: input.trim() }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', { body: { messages: newMessages } })
      if (error) throw error
      setMessages([...newMessages, { role: 'assistant' as const, content: data.reply }])
    } catch (e: any) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }])
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Enhanced Launcher */}
      <button
        aria-label="Open AI Assistant"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9999] rounded-full p-4 bg-primary text-primary-foreground shadow-2xl hover:shadow-xl hover:scale-110 transform transition-all duration-300 pulse-ring"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
      </button>

      {/* Enhanced Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[9998] w-80 sm:w-96 animate-enter">
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-xl glass-morphism">
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-success/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">AI Recovery Assistant</p>
                  <p className="text-xs text-muted-foreground">Here to support your wellness journey</p>
                </div>
              </div>
            </div>

            <ScrollArea className="h-80 p-4 bg-gradient-to-b from-background/50 to-background/80">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground shadow-primary/20' 
                        : 'bg-muted border border-border/50 text-foreground'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-left">
                    <div className="inline-block px-4 py-3 rounded-2xl bg-muted border border-border/50 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? 'AI is thinking...' : 'Ask me anything about your recovery...'}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                  disabled={loading}
                  className="flex-1 border-border/50 focus-visible:ring-primary/50 bg-background/60"
                />
                <Button 
                  onClick={send} 
                  disabled={loading || !input.trim()} 
                  className="shrink-0 px-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="default"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Your AI assistant is here 24/7 to support you
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
