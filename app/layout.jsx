import "./globals.css";

export const metadata = {
  title: "D&D NPC Generator (EN/DA)",
  description: "NPC ideas with weighted ancestries and bilingual trait tables",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
