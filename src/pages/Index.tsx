import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="max-w-md mx-auto space-y-8 py-12 px-6 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Quiet Reflection</h1>
        <p className="text-gray-500 text-lg italic">"Your mind is a canvas. Let it be still."</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm space-y-6 italic text-center">
        <p className="text-xl text-gray-700 leading-relaxed">
          "The present moment is the only time we have to receive. Let this clarity wash over you."
        </p>
      </div>

      <Button 
        className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-bold transition-all group"
        onClick={() => window.location.reload()}
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default Index;