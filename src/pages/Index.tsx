import { useState } from "react";
import { Check } from "lucide-react";

const PROMPT = "What's one thing you're grateful for today?";

const Index = () => {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const canSave = entry.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const existing = JSON.parse(localStorage.getItem("journal_entries") || "[]");
    existing.push({ prompt: PROMPT, entry: entry.trim(), date: new Date().toISOString() });
    localStorage.setItem("journal_entries", JSON.stringify(existing));
    setSaved(true);
  };

  const handleSkip = () => {
    setDismissed(true);
  };

  if (dismissed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Maybe next time 🌿</p>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <p className="text-2xl font-display text-foreground">Reflection Saved!</p>
        <p className="text-muted-foreground">Great job taking a moment for yourself.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 gap-8">
      <h1 className="text-3xl md:text-4xl font-display text-foreground tracking-tight">
        Daily Calm Reflection
      </h1>

      {/* Prompt Card */}
      <div className="prompt-card w-full max-w-md rounded-2xl p-8 text-center">
        <p className="text-lg md:text-xl italic text-foreground/80 leading-relaxed">
          "{PROMPT}"
        </p>
      </div>

      {/* Text Area */}
      <textarea
        className="journal-textarea w-full max-w-md rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        rows={5}
        placeholder="Write your thoughts..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      {/* CTAs */}
      <div className="flex gap-4 items-center">
        <button
          onClick={handleSkip}
          className="px-6 py-2.5 rounded-full text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          Skip
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="journal-save-btn px-8 py-2.5 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Index;
