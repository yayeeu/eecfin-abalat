
import { useState, useEffect, useMemo } from 'react';
import { YouTubeVideo } from '@/types/sermon.types';

export const useSermons = (channelId: string) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [hasRealData, setHasRealData] = useState(false);
  const videosPerPage = 8;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // YouTube API Key - in a production app, this should be server-side
        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        
        if (!API_KEY) {
          console.warn('No YouTube API key found, sermon library will be hidden');
          setHasRealData(false);
          setLoading(false);
          return;
        }
        
        // Check for live streams first
        const liveResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`
        );
        
        const liveData = await liveResponse.json();
        
        if (liveData.items && liveData.items.length > 0) {
          setIsLive(true);
          const liveVideo = liveData.items[0];
          setLiveVideoId(liveVideo.id.videoId);
        } else {
          setIsLive(false);
        }
        
        // Fetch videos from channel
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos from YouTube');
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
          setVideos([]);
          setHasRealData(false);
          setLoading(false);
          return;
        }
        
        const fetchedVideos: YouTubeVideo[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: item.snippet.thumbnails.medium.url
        }));
        
        setVideos(fetchedVideos);
        setHasRealData(true);
        
        // Set the most recent video as the selected video if not live
        if (fetchedVideos.length > 0 && !isLive) {
          setSelectedVideo(fetchedVideos[0].id);
        } else if (isLive && liveVideoId) {
          setSelectedVideo(liveVideoId);
        }
      } catch (err) {
        console.error("Error fetching YouTube videos:", err);
        setError("Failed to load videos. Please try again later.");
        setHasRealData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId, liveVideoId]);

  // Calculate pagination
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  // Group videos by month and year for date-based navigation
  const videosByDate = useMemo(() => {
    return videos.reduce((acc, video) => {
      const date = new Date(video.publishedAt);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(video);
      return acc;
    }, {} as Record<string, YouTubeVideo[]>);
  }, [videos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    videos,
    currentVideos,
    videosByDate,
    loading,
    error,
    selectedVideo,
    setSelectedVideo,
    currentPage,
    totalPages,
    handlePageChange,
    isLive,
    liveVideoId,
    hasRealData
  };
};
