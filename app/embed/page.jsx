"use client";
import DnDNpcGenerator from "@/components/DnDNpcGenerator";
export default function EmbedPage() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <DnDNpcGenerator embed />
      </div>
    </div>
  );
}
