import React, { useState } from "react";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./UploadVideo.css";

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handling video upload
  const handleUpload = () => {
    if (!video) {
      setError("No video selected");
      return;
    }

    const storageRef = ref(storage, `videos/${video.name}`);
    const uploadTask = uploadBytesResumable(storageRef, video);

    setUploading(true);

    //Follow the status of the upload and address any failures.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);
        console.log(`Upload is ${progressPercentage}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        setError("Upload failed, please try again.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const thumbnailURL =
            "https://img.icons8.com/clouds/100/000000/video.png";

          await addDoc(collection(db, "videos"), {
            name: video.name,
            url: downloadURL,
            thumbnail: thumbnailURL,
            timestamp: serverTimestamp(),
            views: 0,
            ratings: [],
          });

          setSuccess("Video uploaded successfully!");
        } catch (err) {
          console.error("Error saving to Firestore:", err);
          setError("Error saving video details. Please try again.");
        }

        setUploading(false);
        setProgress(0);
        setVideo(null);
      }
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
      setError("");
      setSuccess("");
    }
  };

  return (
    <div className="upload-video-container">
      <h2 className="upload-title">Upload Video</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <input
        type="file"
        onChange={handleFileChange}
        accept="video/*"
        className="file-input"
      />

      {uploading ? (
        <div className="progress-container">
          <p>Uploading: {Math.round(progress)}%</p>
          <progress
            value={progress}
            max="100"
            className="progress-bar"
          ></progress>
        </div>
      ) : (
        <button onClick={handleUpload} className="upload-button">
          Upload Video
        </button>
      )}
    </div>
  );
};

export default UploadVideo;
