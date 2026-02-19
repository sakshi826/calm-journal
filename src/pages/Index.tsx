import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowLeft, Send } from "lucide-react";
import { getUserId } from "../lib/auth";
import { saveJournalEntry } from "../lib/db";

const PROMPTS = [
  "What made you smile today?",
  "Describe a challenge you overcame recently.",
  "What are you looking forward to tomorrow?",
  "Write about someone you're grateful for.",
  "What's one thing you want to let go of?"
];

const Index = () => {
  const [entry, setEntry] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const userId = getUserId();
    if (userId && entry.trim()) {
      setIsSaving(true);
      try {
        await saveJournalEntry(userId, {
          content: entry.trim(),
          prompt: PROMPTS[promptIndex],
          logged_at: new Date().toISOString(),
        });
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to save journal entry:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const nextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    setEntry("");
  };

  if (isSaved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-success" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reflection Saved</h2>
          <p className="text-muted-foreground mt-2 max-w-xs">Your thoughts have been safely stored for your future self.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => { setIsSaved(false); setEntry(""); }}
          className="rounded-full px-8"
        >
          Writer another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-70">Journaling Prompt</span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground transition-all duration-500 min-h-[80px]">
          {PROMPTS[promptIndex]}
        </h1>
        <Button variant="ghost" size="sm" onClick={nextPrompt} className="text-muted-foreground hover:text-primary rounded-full">
          Gives me another prompt
        </Button>
      </div>

      <div className="relative group">
        <Textarea
          placeholder="Start writing your heart out..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[300px] text-lg rounded-3xl border-muted bg-muted/20 p-8 shadow-inner transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
        <div className="absolute bottom-6 right-6 text-xs text-muted-foreground pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
          {entry.length} characters
        </div>
      </div>

      <Button
        className="w-full h-16 rounded-3xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        disabled={!entry.trim() || isSaving}
        onClick={handleSave}
      >
        {isSaving ? "Saving..." : "Save Entry"}
        {!isSaving && <Send className="ml-2 w-5 h-5" />}
      </Button>
    </div>
  );
};

export default Index;
