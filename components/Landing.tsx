"use client";

import { Paperclip, Send, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import ImageCard from "./ui/image-card";

interface UploadedImage {
  dataUrl: string;
  name: string;
  size: number;
}

export default function Component() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [chatHistory, setChatHistory] = useState<
    { text: string; images: UploadedImage[] }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const insertAtCursor = (value: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + value + text.slice(end);
    setText(newText);
    setTimeout(() => {
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = start + value.length;
        textarea.focus();
      }
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          // Prevent duplicates by name+size
          if (
            images.some(
              (img) => img.name === file.name && img.size === file.size
            )
          )
            continue;
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl =
              (event.target && (event.target as FileReader).result) || "";
            setImages((prev) => [
              ...prev,
              { dataUrl: dataUrl as string, name: file.name, size: file.size },
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
    e.target.value = "";
  };

  const handleRemoveImage = (name: string, size: number) => {
    setImages((prev) =>
      prev.filter((img) => !(img.name === name && img.size === size))
    );
  };

  const handleSubmit = () => {
    if (!text.trim() && images.length === 0) return;
    setChatHistory((prev) => [...prev, { text, images }]);
    setText("");
    setImages([]);
    toast.info("Submitted!");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          SVGen
        </h1>

        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <p className="text-lg md:text-xl text-foreground">
              NVIDIA NIM Integration
            </p>
          </CardContent>
        </Card>

        {/* Chat log */}
        <div className="space-y-6">
          {chatHistory.map((msg, idx) => (
            <Card key={idx} className="max-w-2xl mx-auto">
              <CardContent>
                <div className="text-left">
                  <div className="font-bold mb-2">You prompted:</div>
                  <div className="flex flex-col items-center mb-2">
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      {msg.images.map((img, i) => (
                        <ImageCard
                          key={img.name + img.size + i}
                          imageUrl={img.dataUrl}
                          caption={img.name}
                          className="w-[100px] min-w-0"
                        />
                      ))}
                    </div>
                    {msg.text && (
                      <span className="block text-base text-foreground rowdies-regular whitespace-pre-line text-center mt-2">
                        {msg.text}
                      </span>
                    )}
                  </div>
                  <hr className="my-4 border-border" />
                  <div className="font-bold mb-2">
                    Here's the SVG we generated:
                  </div>
                  {/* Placeholder for SVG result */}
                  <div className="w-full flex justify-center">
                    <div className="w-[180px] h-[120px] bg-gray-200 border-2 border-dashed border-border rounded flex items-center justify-center text-gray-500 text-xs">
                      [SVG GOES HERE]
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="relative">
            <CardContent className="p-0">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 justify-center w-full">
                  {images.map((img) => (
                    <div
                      key={img.name + img.size}
                      className="flex items-center gap-2"
                    >
                      <ImageCard
                        imageUrl={img.dataUrl}
                        caption={img.name}
                        className="w-[100px] min-w-0"
                      />
                      <Button
                        size="icon"
                        variant="neutral"
                        type="button"
                        onClick={() => handleRemoveImage(img.name, img.size)}
                        className="ml-1"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-2/3 pt-10">
                  <Textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What SVG would you like to create today?"
                    className="w-full bg-transparent border-none outline-2 px-3 py-2 text-foreground placeholder-foreground/60 resize-none focus:outline-none transition-all min-h-[100px] text-sm font-base"
                    rows={4}
                  />
                </div>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div className="absolute bottom-6 left-6 flex items-center space-x-3">
                <Button
                  size="icon"
                  variant="neutral"
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-6 right-6 flex items-center">
                <Button
                  size="icon"
                  variant="default"
                  type="button"
                  onClick={handleSubmit}
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
