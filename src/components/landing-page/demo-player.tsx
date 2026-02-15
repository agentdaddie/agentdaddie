"use client";

import { VideoPlayer } from "../ui/video-player";

export function DemoVideoPlayerDemo() {
  return (
    <VideoPlayer
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      poster="https://peach.blender.org/wp-content/uploads/bbb-splash.png"
      size="default"
      className="aspect-video border rounded-2xl"
    />
  );
}
