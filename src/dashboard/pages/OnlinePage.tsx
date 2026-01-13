import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader,
  ArrowLeft,
  Music,
  X,
  Upload,
} from "lucide-react";
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  image: string;
  isLocal?: boolean;
}
interface OnlinePageProps {
  onBack: () => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onTrackPlay?: (track: Track) => void;
  currentTrack?: Track | null;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  volume?: number;
  setVolume?: (volume: number) => void;
}
export const OnlinePage: React.FC<OnlinePageProps> = ({
  onBack,
  audioRef: sharedAudioRef,
  onTrackPlay,
  currentTrack: sharedCurrentTrack,
  isPlaying: sharedIsPlaying,
  setIsPlaying: setSharedIsPlaying,
  volume: sharedVolume,
  setVolume: setSharedVolume,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [localTracks, setLocalTracks] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animationsEnabled] = useState(() => {
    const saved = localStorage.getItem("animationsEnabled");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const audioRef = sharedAudioRef || localAudioRef;
  const [localCurrentTrack, setLocalCurrentTrack] = useState<Track | null>(
    null
  );
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localVolume, setLocalVolume] = useState(70);
  const currentTrack =
    sharedCurrentTrack !== undefined ? sharedCurrentTrack : localCurrentTrack;
  const isPlaying =
    sharedIsPlaying !== undefined ? sharedIsPlaying : localIsPlaying;
  const setIsPlayingLocal = setSharedIsPlaying || setLocalIsPlaying;
  const volume = sharedVolume !== undefined ? sharedVolume : localVolume;
  const setVolumeLocal = setSharedVolume || setLocalVolume;
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const stored = localStorage.getItem("musicTracks");
    if (stored) {
      setLocalTracks(JSON.parse(stored));
    }
  }, []);
  const handleFiles = (files: FileList) => {
    const newTracks: Track[] = [];
    let loadedCount = 0;
    const audioFiles = Array.from(files).filter((f) =>
      f.type.startsWith("audio/")
    );
    audioFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newTrack: Track = {
          id: `local-${Date.now()}-${Math.random()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Local",
          duration: 0,
          url: e.target?.result as string,
          image: "https://via.placeholder.com/80/6b4a5a/ffdfbb?text=Music",
          isLocal: true,
        };
        newTracks.push(newTrack);
        loadedCount++;
        if (loadedCount === audioFiles.length) {
          const updated = [...localTracks, ...newTracks];
          setLocalTracks(updated);
          localStorage.setItem("musicTracks", JSON.stringify(updated));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };
  const searchTracks = (query: string) => {
    if (!query.trim()) {
      setTracks([]);
      return;
    }
    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    const filtered = localTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery)
    );
    setTimeout(() => {
      setTracks(filtered);
      setIsSearching(false);
    }, 300);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    searchTracks(e.target.value);
  };
  const playTrack = (track: Track) => {
    if (onTrackPlay) {
      onTrackPlay(track);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.volume = volume / 100;
      }
      setLocalCurrentTrack(track);
      setLocalIsPlaying(true);
    }
  };
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlayingLocal(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Play error:", err));
      setIsPlayingLocal(true);
    }
  };
  const handleVolumeChange = (newVolume: number) => {
    setVolumeLocal(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  const deleteTrack = (id: string) => {
    const updated = localTracks.filter((t) => t.id !== id);
    setLocalTracks(updated);
    setTracks(updated);
    localStorage.setItem("musicTracks", JSON.stringify(updated));
    if (currentTrack?.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setLocalCurrentTrack(null);
      setIsPlayingLocal(false);
    }
  };
  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(
      () => {
        onBack();
        setIsFadingOut(false);
      },
      animationsEnabled ? 300 : 0
    );
  };
  useEffect(() => {
    if (!sharedAudioRef && currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Play error:", err));
      }
    }
  }, [currentTrack, sharedAudioRef]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffdfbb",
        display: "flex",
        flexDirection: "column",
        opacity: isFadingOut ? 0 : 1,
        transition: animationsEnabled ? "opacity 0.3s ease-out" : "none",
        position: "relative",
      }}
    >
      {}
      {!sharedAudioRef && (
        <audio
          ref={audioRef}
          onEnded={() => setLocalIsPlaying(false)}
          crossOrigin="anonymous"
        />
      )}
      {}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      {}
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 16px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          color: "#6b4a5a",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>
      {}
      <div
        style={{
          padding: "30px 20px 0",
          textAlign: "center",
          color: "#6b4a5a",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "20px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
          }}
        >
          Music
        </div>
      </div>
      {}
      {currentTrack && (
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            marginBottom: "12px",
            marginLeft: "20px",
            marginRight: "20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Music size={20} color="#6b4a5a" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#6b4a5a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "2px",
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#999",
              }}
            >
              {currentTrack.artist}
            </div>
          </div>
          <button
            onClick={togglePlayPause}
            style={{
              backgroundColor: "#6b4a5a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              flexShrink: 0,
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: "70px",
            }}
          >
            {volume > 0 ? (
              <Volume2 size={14} color="#6b4a5a" />
            ) : (
              <VolumeX size={14} color="#6b4a5a" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              style={{
                flex: 1,
                height: "3px",
                borderRadius: "2px",
                backgroundColor: "#ddd",
                outline: "none",
                cursor: "pointer",
                accentColor: "#6b4a5a",
              }}
            />
          </div>
        </div>
      )}
      {}
      <div
        style={{
          padding: "0 20px 20px",
          display: "flex",
          gap: "8px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isSearching ? (
            <Loader
              size={18}
              color="#6b4a5a"
              style={{
                marginRight: "8px",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <Search size={18} color="#6b4a5a" style={{ marginRight: "8px" }} />
          )}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
              color: "#6b4a5a",
              outline: "none",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
            }}
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#6b4a5a",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          title="Upload music"
        >
          <Upload size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>
      {}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "0 20px 20px",
        }}
      >
        {isSearching ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#6b4a5a",
              fontSize: "14px",
            }}
          >
            Searching...
          </div>
        ) : searchQuery && tracks.length === 0 && !isSearching ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#6b4a5a",
              fontSize: "14px",
            }}
          >
            No tracks found
          </div>
        ) : localTracks.length === 0 && searchQuery === "" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "#6b4a5a",
              fontSize: "14px",
            }}
          >
            No music yet. Click upload to add files.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(searchQuery ? tracks : localTracks).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Music size={20} color="#6b4a5a" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b4a5a",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {track.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    {track.artist}
                  </div>
                </div>
                {track.isLocal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTrack(track.id);
                    }}
                    style={{
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Delete"
                  >
                    <X size={14} />
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
