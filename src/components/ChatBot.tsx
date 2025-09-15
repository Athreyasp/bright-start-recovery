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
      {/* Launcher */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 rounded-full p-4 bg-primary text-primary-foreground shadow-lg hover:opacity-90 focus:outline-none"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 animate-enter">
          <Card className="border shadow-xl bg-background">
            <div className="p-4 border-b">
              <p className="font-semibold">AI Chatbot</p>
              <p className="text-xs text-muted-foreground">Ask about wellness, appointments, or app help.</p>
            </div>

            <ScrollArea className="h-72 p-4">
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </ScrollArea>

            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? 'Thinking…' : 'Type your message'}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                disabled={loading}
              />
              <Button onClick={send} disabled={loading || !input.trim()} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
