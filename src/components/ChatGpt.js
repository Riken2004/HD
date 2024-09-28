import React, { useState, useCallback } from "react";
// Using lodash for debouncing
import debounce from "lodash.debounce";

const ChatGpt = () => {
  // Set up states initially

  // State for handling user input
  const [query, setQuery] = useState("");
  // State for handling chatGPT response
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // State for handling loading
  const fetchChatGptResponse = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/chatgpt", {
        // Update to port 5001
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //User message sent to the backend

        body: JSON.stringify({ userMessage: query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      //Give the answer from ChatGPT.
      setResponse(data.message);
    } catch (error) {
      setResponse("Error fetching GPT response: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function to limit the number of requests
  const debouncedFetch = useCallback(debounce(fetchChatGptResponse, 1000), [
    query,
  ]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <input
        type="text"
        placeholder="Ask Chat GPT"
        value={query}
        //Update the status upon modification

        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px", padding: "10px", borderRadius: "5px" }}
      />
      <button onClick={debouncedFetch} style={{ marginLeft: "10px" }}>
        {/* While waiting, display loading */}
        {loading ? "Loading..." : "Submit"}
      </button>
      <div>{response}</div>
    </div>
  );
};

export default ChatGpt;
