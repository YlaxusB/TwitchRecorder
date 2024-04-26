"use client";
import Head from "next/head";
import StreamPreview from "../components/StreamPreview";
import ChannelPreview from "../components/ChannelPreview";
import { useState, useContext, useSyncExternalStore } from "react";
import { getAccessToken } from "../services/getAccessToken";
import Link from "next/link";

import { SearchContext, SearchProvider } from "../contexts/SearchContext";

const displayLivestreamArray = (array) => {
  return array.map((stream) => {
    return (
      <div>
        <ChannelPreview liveStream={stream}></ChannelPreview>
      </div>
    );
  });
};

const colorType = "red-50";
export default function Home({ Component, pageProps }) {
  //fetchData();
  const [counter, setCounter] = useState(0);
  const search = useContext(SearchContext);

  const [homeLivestreamsData, setHomeLivestreamsData] = useState([]);
  const fetchData = async () => {
    console.log(search);
    const queryParams = {
      query: search.searchInput,
    };
    const accessToken = await getAccessToken();
    const response = await fetch(
      "https://api.twitch.tv/helix/search/channels?query=" + queryParams.query,
      {
        headers: {
          "Client-Id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          Authorization: `Bearer ${accessToken}`, // assuming getAccessToken is a function
        },
      }
    );

    if (response.ok) {
      const requestJson = await response.json();
      const data = requestJson.data;
      const liveStreams = data.map((stream) => ({
        channelName: stream.user_name,
        title: stream.title,
        game: stream.game_name,
        thumbnailUrl: stream.thumbnail_url,
      }));

      setHomeLivestreamsData(liveStreams);
    }
  };

  return (
    <div className="flex">
      <div className="lives-container flex flex-wrap gap-4">
        {displayLivestreamArray(homeLivestreamsData)}

        <Link
          onClick={() => {
            setCounter(counter + 1);
            fetchData();
          }}
          href={"/search"}
        >
          CLick me
        </Link>
      </div>
    </div>
  );
}
