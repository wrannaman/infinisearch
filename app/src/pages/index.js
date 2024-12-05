import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Demo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [limit, setLimit] = useState(100);
  const [currentVideo, setCurrentVideo] = useState('demo1.mp4');

  useEffect(() => {
    // Get video duration once the metadata is loaded
    const video = document.getElementById('demoVideo');
    if (video) {
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration * 1000); // Convert to milliseconds
      };
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://192.168.4.60:5555/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          limit: limit
        }),
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimelineClick = (timestamp, videoName) => {
    const video = document.getElementById('demoVideo');
    if (!video) return;

    if (videoName !== currentVideo) {
      // First change the video
      setCurrentVideo(videoName);

      // Give time for video to load
      setTimeout(() => {
        const video = document.getElementById('demoVideo');
        if (video) {
          video.currentTime = timestamp / 1000;
          video.play();
        }
      }, 100);
    } else {
      // Same video, just seek
      video.currentTime = timestamp / 1000;
      video.play();
    }
  };

  // Add this function to filter results for current video
  const getCurrentVideoResults = () => {
    return results.filter(result => result.video_name === currentVideo);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Video Search Demo</title>
      </Head>

      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="flex gap-4">
              <input
                type="text"
                name="query"
                id="query"
                className="flex-1 min-w-0 block px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What do you want to find?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <input
                type="number"
                name="limit"
                id="limit"
                min="1"
                max="1000"
                className="w-24 px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="pt-20 flex h-[calc(100vh-5rem)]">
        <div className="w-1/2 p-4">
          <div className="sticky top-24 w-full">
            <video
              key={currentVideo}
              id="demoVideo"
              controls
              className="w-full rounded-lg shadow-lg"
              src={`http://192.168.4.60:8080/${currentVideo}`}
              onLoadedData={(e) => {
                setVideoDuration(e.target.duration * 1000);
              }}
            >
              Your browser does not support the video tag.
            </video>

            <div className="mt-4 relative h-8 bg-gray-200 rounded-lg w-full">
              {getCurrentVideoResults().map((result, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full bg-indigo-500 cursor-pointer"
                  style={{
                    left: `${(result.timestamp_ms / videoDuration) * 100}%`,
                    width: '2px'
                  }}
                  onClick={() => handleTimelineClick(result.timestamp_ms, result.video_name)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full overflow-hidden">
          <div className="h-full overflow-y-auto px-4">
            <h3 className="text-lg font-medium text-gray-900 sticky top-0 bg-gray-100 py-2">
              Results {results.length > 0 && `(${results.length})`}
            </h3>

            <div className="space-y-4 pb-4">
              {results.map((result, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Video: {result.video_name}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        Timestamp: {result.timestamp_str}
                      </p>
                      <p className="text-sm text-gray-500">
                        Frame: {result.frame_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        Score: {result.score.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTimelineClick(result.timestamp_ms, result.video_name)}
                      className="shrink-0 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Jump to Scene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}