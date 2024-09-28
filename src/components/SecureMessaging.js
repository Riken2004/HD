import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import "./SecureMessaging.css";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import CryptoJS from "crypto-js";

const SecureMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const decryptedMessages = fetchedMessages.map((msg) => {
        try {
          // Try to decode the message.
          const decryptedText = CryptoJS.AES.decrypt(
            msg.text,
            "secret-key"
          ).toString(CryptoJS.enc.Utf8);

          // Return the original text if the decrypted text is empty.
          return { ...msg, text: decryptedText || msg.text };
        } catch (error) {
          console.error("Error decrypting message: ", error);
          // If decryption fails, return the message exactly as it is.

          return { ...msg, text: msg.text };
        }
      });

      setMessages(decryptedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage || !user) return;

    const encryptedMessage = CryptoJS.AES.encrypt(
      newMessage,
      "secret-key"
    ).toString();

    await addDoc(collection(db, "messages"), {
      text: encryptedMessage,
      sender: user.email,
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  return (
    <div className="chat-container">
      <h2>Secure Messaging</h2>

      <ul className="chat">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`message ${
              msg.sender === user?.email ? "right" : "left"
            }`}
          >
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="logo"
            />
            <p>{msg.text}</p>
            <span className="message-time">
              {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}
            </span>
            {msg.sender === user?.email && (
              <button
                className="delete-btn"
                onClick={() => deleteMessage(msg.id)}
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="text_input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" onClick={sendMessage}>
          send
        </button>
      </div>
    </div>
  );
};

export default SecureMessaging;
