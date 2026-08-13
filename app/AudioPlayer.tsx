"use client";

import { useEffect, useRef, useState } from "react";
import { X, SkipBack, SkipForward, Play, Pause, Volume2, Loader2 } from "lucide-react";
import type { songs } from "@/app/songs";
import { thumbnailUrl } from "@/app/songs";

interface AudioPlayerProps {
  songs: songs[];
  onClose?: () => void;
}

export function AudioPlayer({ songs, onClose }: AudioPlayerProps) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const ambientPlaybackIdRef = useRef<string>(songs[0].id);

  const song = songs[index];

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct =
    duration > 0 && playerRef.current?.getVideoLoadedFraction
      ? playerRef.current.getVideoLoadedFraction() * 100
      : 0;

  const playSong = (i: number) => {
    const id = songs[i].id;
    const p = playerRef.current;
    if (!p) return;
    if (p.getVideoData?.()?.video_id === id) {
      p.playVideo();
    } else {
      ambientPlaybackIdRef.current = id;
      p.loadVideoById(id);
    }
    setIndex(i);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

  const handleNext = () => playSong((index + 1) % songs.length);
  const handlePrev = () =>
    playSong((index - 1 + songs.length) % songs.length);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
  };

  useEffect(() => {
   
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const onReady = () => {
      playerRef.current?.setVolume(volume);
      playerRef.current?.loadVideoById(songs[0].id);
    };

    const onStateChange = (e: YT.OnStateChangeEvent) => {
      switch (e.data) {
        case YT.PlayerState.PLAYING:
          setIsPlaying(true);
          setIsBuffering(false);
          setDuration(playerRef.current?.getDuration() ?? 0);
          break;
        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          setIsBuffering(false);
          break;
        case YT.PlayerState.BUFFERING:
          setIsBuffering(true);
          break;
        case YT.PlayerState.ENDED:
          setIsBuffering(false);
          setIsPlaying(false);
          
          playSong((index + 1) % songs.length);
          break;
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      const p = new window.YT.Player(hostRef.current!, {
        videoId: songs[0].id,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
        events: {
          onReady,
          onStateChange,
        },
      });
      playerRef.current = p;
    };

    
    const timer = setInterval(() => {
      const p = playerRef.current;
      if (p && isPlaying) {
        setCurrentTime(p.getCurrentTime());
      }
    }, 500);

    return () => {
      clearInterval(timer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 p-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-white/70 transition hover:text-white"
            aria-label="Close player"
          >
            <X size={18} />
          </button>
        )}

        <img
          src={thumbnailUrl(song)}
          alt={song.title}
          className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{song.title}</p>
              <p className="truncate text-sm text-white/60">{song.artist}</p>
            </div>
            <p className="ml-2 text-xs text-white/50">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          <div className="relative mt-1.5 h-1.5 w-full rounded-full bg-white/20">
            
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/30"
              style={{ width: `${bufferedPct}%` }}
            />
           
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-yellow-400"
              style={{ width: `${progressPct}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-1 text-white/80 transition hover:text-white"
            aria-label="Previous"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-bold text-black transition hover:bg-yellow-300"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-1 text-white/80 transition hover:text-white"
            aria-label="Next"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Volume2 size={18} className="text-white/50" />
          <span className="text-xs text-white/50">{volume}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolume}
            className="h-1.5 w-24 accent-yellow-400"
            aria-label="Volume"
          />
        </div>
      </div>

     
      <div ref={hostRef} className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0" />
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}