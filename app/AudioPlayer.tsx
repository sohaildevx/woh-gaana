"use client";

import { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Play, Pause, Volume2, Loader2 } from "lucide-react";
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
  const indexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const playing = songs[index];
  const current = playerRef.current?.getCurrentTime?.() ?? currentTime;

  const syncIndex = (i: number) => {
    indexRef.current = i;
    setIndex(i);
  };

  const goTo = (i: number) => {
    const p = playerRef.current;
    if (!p) return;
    const id = songs[i].id;
    if (p.getVideoData?.()?.video_id === id) {
      p.playVideo();
    } else {
      p.loadVideoById(id);
    }
    syncIndex(i);
    setIsPlaying(true);
    isPlayingRef.current = true;
  };

  const playNext = () => goTo((indexRef.current + 1) % songs.length);
  const playPrev = () =>
    goTo((indexRef.current - 1 + songs.length) % songs.length);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlayingRef.current) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

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
      playerRef.current?.loadVideoById(songs[indexRef.current].id);
    };

    const onStateChange = (e: YT.OnStateChangeEvent) => {
      switch (e.data) {
        case YT.PlayerState.PLAYING:
          setIsPlaying(true);
          isPlayingRef.current = true;
          setIsBuffering(false);
          setDuration(playerRef.current?.getDuration() ?? 0);
          break;
        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          isPlayingRef.current = false;
          setIsBuffering(false);
          break;
        case YT.PlayerState.BUFFERING:
          setIsBuffering(true);
          break;
        case YT.PlayerState.ENDED:
          setIsBuffering(false);
          setIsPlaying(false);
          isPlayingRef.current = false;
          playNext();
          break;
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      const p = new window.YT.Player(hostRef.current!, {
        videoId: songs[indexRef.current].id,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
        events: { onReady, onStateChange },
      });
      playerRef.current = p;
    };

    const timer = setInterval(() => {
      const p = playerRef.current;
      if (p && isPlayingRef.current) {
        setCurrentTime(p.getCurrentTime());
      }
    }, 500);

    return () => {
      clearInterval(timer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = duration > 0 ? (current / duration) * 100 : 0;
  const bufferedPct =
    duration > 0 && playerRef.current?.getVideoLoadedFraction
      ? playerRef.current.getVideoLoadedFraction() * 100
      : 0;

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 border-t border-white/10 bg-black/60 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm sm:bottom-10 sm:bg-transparent sm:px-4 sm:pb-4 sm:pt-5 sm:backdrop-blur-none">
      <div className="mx-auto max-w-3xl">
        
        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex items-center gap-3">
            <img
              src={thumbnailUrl(playing)}
              alt={playing.title}
              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white drop-shadow">
                {playing.title}
              </p>
              <p className="truncate text-sm text-white/60 drop-shadow">
                {playing.artist}
              </p>
            </div>
            <p className="text-xs text-white/60 drop-shadow">
              {formatTime(current)}
            </p>
          </div>

          <div className="relative h-1.5 w-full rounded-full bg-white/20">
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
              value={current}
              onChange={handleSeek}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <button
                onClick={playPrev}
                className="p-2 text-white/80 transition hover:text-white"
                aria-label="Previous"
              >
                <SkipBack size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 font-bold text-black transition hover:bg-yellow-300"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} />
                )}
              </button>
              <button
                onClick={playNext}
                className="p-2 text-white/80 transition hover:text-white"
                aria-label="Next"
              >
                <SkipForward size={24} />
              </button>
              <span className="ml-1 hidden text-xs text-white/60 drop-shadow min-[360px]:inline">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Volume2 size={16} className="hidden text-white/50 min-[360px]:block" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolume}
                className="h-1.5 w-16 accent-yellow-400 min-[400px]:w-20"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        
        <div className="hidden items-center gap-4 sm:flex">
          <img
            src={thumbnailUrl(playing)}
            alt={playing.title}
            className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium text-white drop-shadow">
                  {playing.title}
                </p>
                <p className="truncate text-sm text-white/60 drop-shadow">
                  {playing.artist}
                </p>
              </div>
              <p className="ml-2 text-xs text-white/60 drop-shadow">
                {formatTime(current)} / {formatTime(duration)}
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
                value={current}
                onChange={handleSeek}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Seek"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={playPrev}
              className="p-1 text-white/80 transition hover:text-white"
              aria-label="Previous"
            >
              <SkipBack size={22} />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 font-bold text-black transition hover:bg-yellow-300"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isBuffering ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>
            <button
              onClick={playNext}
              className="p-1 text-white/80 transition hover:text-white"
              aria-label="Next"
            >
              <SkipForward size={22} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-white/50" />
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
      </div>

      <div
        ref={hostRef}
        className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}