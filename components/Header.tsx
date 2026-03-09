"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-8">
        <h1 className="font-display text-lg font-medium tracking-wide text-textMain sm:text-xl">
          Prompt<span className="text-accent italic ml-1">Library</span>
        </h1>
      </div>
    </header>
  );
}
