import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV = [{ href: "/reading-list", label: "읽을 책" }];

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-6 px-6 py-3">
        <Link href="/reading-list" className="font-semibold tracking-tight">
          책길
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          {NAV.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              render={<Link href={item.href} />}
              nativeButton={false}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/settings" />}
          nativeButton={false}
        >
          내 정보
        </Button>
      </div>
    </header>
  );
}
