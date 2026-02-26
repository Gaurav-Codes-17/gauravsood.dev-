"use client";
import { useEffect } from "react";

export default function TrackVisit()  {
 useEffect(() => {
  console.log("TrackVisit mounted");
  fetch("/api/track")
    .then(res => res.json())
    .then(data => console.log("Response:", data))
    .catch(err => console.error("Fetch error:", err));
}, []);

  return null;
}