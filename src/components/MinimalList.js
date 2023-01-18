import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const firebaseConfig = {
  apiKey: "AIzaSyCpuya2tMS3F7ghjqeO5oMUDsH8RGYQu5o",
  authDomain: "min-list.firebaseapp.com",
  projectId: "min-list",
  storageBucket: "min-list.appspot.com",
  messagingSenderId: "15705386157",
  appId: "1:15705386157:web:dec7dac76bae126c07ea24",
  measurementId: "G-HXVJV4LPHK",
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();

function MinimalList() {
  const [listItems, setListItems] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("listItems")
      .onSnapshot((snapshot) => {
        const newListItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListItems(newListItems);
      });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      title: title,
      text: text,
      rating: rating,
    };
    firestore.collection("listItems").add(newItem);
    setTitle("");
    setText("");
    setRating(1);
  };

  const handleClick = (itemId, newRating) => {
    firestore.collection("listItems").doc(itemId).update({ rating: newRating });
  };
  return (
    <div className="list-container">
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            className="input-field"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />

        <label>
          Text:
          <textarea
            className="input-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <br />
        <button className="submit-button" type="submit">
          Add Item
        </button>
      </form>
      <br />
      <ul className="list-items">
        {listItems.map((item) => (
          <li key={item.id}>
            <h3 className="item-title">{item.title}</h3>
            <p className="item-text">{item.text}</p>
            <div className="star-rating">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  className={`${index <= item.rating ? "active" : ""}`}
                  onClick={() => handleClick(item.id, index)}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MinimalList;
