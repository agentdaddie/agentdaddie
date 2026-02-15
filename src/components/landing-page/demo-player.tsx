"use client";

import { VideoPlayer } from "../ui/video-player";

export function DemoVideoPlayerDemo() {
  return (
    <VideoPlayer
      src="https://bucket.agentdaddie.com/agentdaddie.mov"
      poster="/thumbnail.png"
      playbackRate={2}
      size="default"
      className="aspect-video border rounded-2xl"
    />
  );
}
