export function HighlightedComponent({
  text = "",
  color = "oklch(0.657 0.144 247.45)",
}: {
  text: string;
  color?: string;
}) {
  return (
    <div className="relative inline-block space-y-1">
      <div className="relative z-10">{text}</div>
      <svg
        className="absolute bottom-0 left-0 w-full h-3 -z-0"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
      >
        <path
          d="M5,6 Q50,2 95,6"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const Hero = () => {
  return (
    <div className="space-y-6 md:space-y-4">
      <h1 className="text-4xl text-white font-semibold leading-none tracking-tighter z-50">
        {/* Build functional & <span className="font-serif italic text-orange-400">beautiful</span> interface with <HighlightedComponent text="consistent"/> design. */}
        Deploy <span className="text-destructive">Open Claw</span> to your own server in minutes. No code, no stress, just
        a few clicks.
      </h1>
      <p className="font-[550] text-muted-foreground z-50 pr-2 tracking-wider md:tracking-wide text-balance">
        Open Claw is meant to be self-hosted. Open Claw stores tokens and API keys in plain text, so do not be foolish enough to hand over your private credentials on a silver platter to some random stranger on the internet.
        <br/> Deploy it on your own server and stay in control of your data.
        <br/>
      </p>
    </div>
  );
};

export default Hero;
