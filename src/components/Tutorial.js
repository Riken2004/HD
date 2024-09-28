import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Tutorial.css";

const Tutorial = () => {
  const [videos, setVideos] = useState([]);
  //Observe the most recent document for pagination.

  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  // Follow the chosen video

  const [selectedVideo, setSelectedVideo] = useState(null);
  // Monitor the rating.

  const [rating, setRating] = useState(0);

  // Get the first few videos.
  const fetchVideos = async () => {
    setLoading(true);
    const q = query(collection(db, "videos"), orderBy("timestamp"), limit(5));
    const querySnapshot = await getDocs(q);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastDoc(lastVisibleDoc);
    setVideos(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  //When "Load More" is selected, retrieve further videos.
  const loadMoreVideos = async () => {
    setLoading(true);
    const q = query(
      collection(db, "videos"),
      orderBy("timestamp"),
      startAfter(lastDoc),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastDoc(lastVisibleDoc);
    setVideos((prev) => [
      ...prev,
      ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ]);
    setLoading(false);
  };

  // Choose a video to start playing.
  const handleVideoSelect = async (video) => {
    setSelectedVideo(video);
    //Views increase when a video is chosen.
    await incrementViews(video);
  };

  // Increased Firestore video views
  const incrementViews = async (video) => {
    const videoRef = doc(db, "videos", video.id);
    await updateDoc(videoRef, {
      views: video.views + 1,
    });
    setSelectedVideo((prev) => ({ ...prev, views: video.views + 1 }));
  };

  //Manage the submission of user ratings
  const handleRating = async (video, selectedRating) => {
    const videoRef = doc(db, "videos", video.id);

    // Update the video's rating in Firestore.
    const updatedRatings = [...(video.ratings || []), selectedRating];
    await updateDoc(videoRef, {
      ratings: updatedRatings,
    });

    // Calculate average rating
    const averageRating =
      updatedRatings.reduce((acc, curr) => acc + curr, 0) /
      updatedRatings.length;

    setSelectedVideo((prev) => ({
      ...prev,
      ratings: updatedRatings,
      averageRating,
    }));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Calculate average rating
  const calculateAverageRating = (ratings = []) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, curr) => acc + curr, 0);
    return (total / ratings.length).toFixed(1);
  };

  return (
    <div className="tutorial-container">
      <h2>Video Tutorials</h2>

      {/* Video list */}
      <div className="video-list">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            onClick={() => handleVideoSelect(video)} // Handle video selection
            style={{ cursor: "pointer" }}
          >
            <p>{video.name}</p>
            <p>Views: {video.views}</p>
          </div>
        ))}
      </div>

      {/* Display the selected video */}
      {selectedVideo && (
        <div className="video-player">
          <h3>{selectedVideo.name}</h3>
          <video
            src={selectedVideo.url}
            controls
            width="600"
            style={{ marginTop: "20px" }}
          >
            Your browser does not support the video tag.
          </video>

          <p>Views: {selectedVideo.views}</p>
          <p>
            Average Rating: {calculateAverageRating(selectedVideo.ratings)} / 5
          </p>

          {/* Rating buttons */}
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(selectedVideo, star)}
                style={{
                  padding: "10px",
                  margin: "5px",
                  backgroundColor: rating >= star ? "#ffc107" : "#e4e5e9", // highlights stars according to grade
                }}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      <button onClick={loadMoreVideos} disabled={loading}>
        Load More
      </button>
    </div>
  );
};

export default Tutorial;
