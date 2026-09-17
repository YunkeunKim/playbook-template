import { BookOpenIcon } from "lucide-react";

export function BookCover({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
        <BookOpenIcon className="text-muted-foreground" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-16 w-12 rounded object-cover" />
  );
}
