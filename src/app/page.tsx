// app/page.tsx
import VoiceInput from "./components/VoiceInput/VoiceInput";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl mx-auto">
        <VoiceInput />
      </div>
    </main>
  );
}
