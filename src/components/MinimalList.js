import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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
  const [rating, setRating] = useState(1);

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
          <input
            className="input-field"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
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
            <p>Rating: {item.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MinimalList;
