import { cn } from "@/lib/utils";

type Props = {
  imageUrl: string;
  caption: string;
  className?: string;
};

export default function ImageCard({ imageUrl, caption, className }: Props) {
  return (
    <figure
      className={cn(
        "w-[100px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
        className
      )}
    >
      <img
        className="w-full aspect-[1/1] h-[80px] object-cover"
        src={imageUrl}
        alt="image"
      />
      <figcaption className="border-t-2 text-main-foreground border-border p-1 text-[10px] leading-tight truncate text-center">
        {caption}
      </figcaption>
    </figure>
  );
}
