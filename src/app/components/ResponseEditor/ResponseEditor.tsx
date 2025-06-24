"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IResponseEditorProps } from "./types";

export default function ResponseEditor({
  content,
  onChange,
}: IResponseEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const newContent = editor.getHTML();
    if (content !== newContent) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border rounded p-4 min-h-32 bg-white">
      <EditorContent editor={editor} />
    </div>
  );
}
