"use client";

import { useState, useEffect } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import ResponseEditor from "../ResponseEditor/ResponseEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Mic, MicOff, Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { FaceIDLoader } from "../FaceIDLoader/FaceIDLoader";
import { ISpeechRecognitionHook, IVoiceInputProps } from "./types";

export default function VoiceInput({
  initialPrompt = "",
  onSend,
}: IVoiceInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  }: ISpeechRecognitionHook = useSpeechRecognition();

  useEffect(() => {
    setPrompt(text);
  }, [text]);

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(Math.min(currentProgress, 100));
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      setError("Пожалуйста, введите или произнесите запрос");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    simulateProgress();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResponse(data.message || "Не удалось получить ответ");
      if (onSend) onSend(prompt);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Ошибка при получении ответа. Пожалуйста, попробуйте снова.");
    } finally {
      setProgress(100);
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardHeader className="gap-2 px-0 pt-0">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <span>ИИ-Агент для генерации файла с резюме</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {hasRecognitionSupport ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 p-1">
              <Button
                onClick={handleToggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="gap-2"
                disabled={isLoading}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Остановить запись
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Начать запись
                  </>
                )}
              </Button>
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Слушаю...</span>
                </div>
              )}
            </div>
            {text && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm">Распознано: {text}</p>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="destructive" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ваш браузер не поддерживает распознавание речи
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="prompt">Ваш запрос</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Введите текст или используйте голосовой ввод..."
            className="min-h-[48px]"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleSendPrompt}
            disabled={isLoading || !prompt.trim()}
            className="w-full gap-2 p-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Отправка...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Отправить запрос
              </>
            )}
          </Button>
          {isLoading && <FaceIDLoader progress={progress} />}
        </div>
      </CardContent>
      {response && (
        <CardFooter className="flex flex-col items-start gap-4 p-6 pt-0">
          <h3 className="font-semibold text-lg">Ответ ИИ:</h3>
          <div className="w-full p-1">
            <ResponseEditor content={response} onChange={setResponse} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
