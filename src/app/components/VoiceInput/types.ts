export interface IVoiceInputProps {
  initialPrompt?: string;
  onSend?: (prompt: string) => void;
}
export interface ISpeechRecognitionHook {
  text: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
}
