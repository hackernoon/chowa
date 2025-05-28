import React, {useState, useRef, useEffect} from "react";
import styled from '@emotion/styled';
// import Button from "../../../components/Button";
import {renderToString} from "react-dom/server";
// import Youtube from "../../../components/editor/Youtube";
// import {HackerNoonEmbeds} from "../../../components/editor/HackerNoonEmbeds";

const Wrapper = styled.div(`
  width: 400px;
  padding: 10px;
  position: absolute;
  top: 45px;
  background: #ffffff;
  border: 1px solid #c3c3c3;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 10px;
  .text-input, .val-input{
    padding: 8px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #d7d7d7;
    width: -webkit-fill-available;
    font-weight: 500;
  }    

  .link-button{
    background: #5e5e5e !important;
    width: 100% !important;
    border-radius: 5px;
    color: #ffffff;
    font-weight: 600;
    &:hover{
      color: lime !important;
    }
  }

  .switch {
    -webkit-appearance: none;
    height: 20px;
    width: 36px;
    background-color: gray;
    border-radius: 43px;
    position: relative;
    cursor: pointer;
    &::after {
      content: "";
      top: 0px;
      left: 0px;
      content: "";
      width: 20px;
      height: 20px;
      background-color: rgb(36, 36, 36);
      position: absolute;
      border-radius: 100%;
      transition: 1s;
    }
    &:checked {
      background-color: rgb(0, 170, 34);
      &::after {
        transform: translateX(16px);
      }
    }
    &:focus {
      outline-color: transparent;
    }
  }

  iframe{
    width: 100%;
  }

  .ais-SearchBox {
    width: 100%;
  }
  .ais-SearchBox-form{
    .ais-SearchBox-input {
      // border-radius: 20px;
      border: 1px solid #e0e0e0;
      padding: 8px;
      font-size: 14px;
      border-radius: 5px;
      border: 1px solid #d7d7d7;
      width: 100%;
    }
    .ais-SearchBox-submit, .ais-SearchBox-reset {
      display: none;
    }
  }

  .link-suggestions{
    margin: 10px 0;
    background: #dfdfdf;
    border-radius: 5px;
    height: 200px;
    overflow: auto;
    .link-suggestion{
      padding: 5px;
      cursor: pointer;
      display: flex;
      gap: 5px;
      .suggestion-img{
        width: 25px;
        height: 25px;
        position: relative;
        img{
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
      }
      &:hover{
        transition: 0.2s all;
        background: #3d3d3d;
        color: #ffffff;
      }
    }
  }

`);


const youtubeRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g;
const twitterRegex = /^https:\/\/x.com/i;
const regLinkRegex = /^(https):\/\/[^\s$.?#].[^\s]*$/g;
const codepenRegex = new RegExp("^https://codepen.io/", "g");
const githubGistRegex = new RegExp("^https://gist.github.com/", "g");

const isURL = str => {
  const pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(:\d+)?(\/[^\s]*)?$/i;
  return pattern.test(str);
};

const TweetEmbed = ({url}) => {
  const tweetId = url?.split("/").pop();

  // Construct the embed URL
  // const embedUrl = `https://platform.twitter.com/widgets/tweet.html?tweet_id=${tweetId}`;
  const embedUrl = `https://publish.twitter.com/oembed?url=https://twitter.com/status/${tweetId}`;

  // console.log("embedUrl", embedUrl);

  return (
    <div>
      <h2>Embedded Tweet</h2>
      <iframe
        src={embedUrl}
        width="500"
        height="300"
        style={{border: "none"}}
        allow="autoplay; encrypted-media; picture-in-picture"
      ></iframe>
    </div>
  );
};

const QuillLink = ({addUrl, deleteUrl, link = "", close, handleEmbed}) => {
  // const [val, setVal] = useState(link);
  const [searchState, setSearchState] = useState({query: link});

  const [embed, setEmbed] = useState(false);
  const [indexSearch, setIndexSearch] = useState();
  const [shouldDisplaySuggestion, setShouldDisplaySuggestion] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddUrl = (e, data) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const val = data?.url;
    if (isURL(val)) {
      if (embed) {
        const urlType = val?.match(youtubeRegex) ? "youtube" : val?.match(twitterRegex) ? "twitter" : "none";
        if (urlType === "twitter") {
          const iframe = document.querySelector(".tweet-container iframe");
          if (iframe) {
            iframe.style["justify-self"] = "center";
            const htmlString = iframe?.outerHTML;
            handleEmbed(htmlString);
          }
        } else if (urlType === "youtube") {
          const iframe = document.querySelector(".youtube-container iframe");
          if (iframe) {
            iframe.style["justify-self"] = "center";

            const htmlString = iframe?.outerHTML;

            handleEmbed(htmlString);
          }
        } else {
          const iframe = document.querySelector(".embed-hn-story");
          if (iframe) {
            const htmlString = iframe?.outerHTML;
            handleEmbed(htmlString);
          }
        }
      } else {
        addUrl(data);
      }
    } else {
      close();
    }
  };

  return (
    <Wrapper ref={ref}>
      <div>
        <label>Enter Link:</label>
          <input
            className="val-input"
            autoFocus
            placeholder="search or add link"
            value={searchState?.query}
            onChange={e => {
              setSearchState({query: e.target.value});
              if (e.target?.value?.startsWith("@")) {
                setIndexSearch("people");
              } else if (e.target?.value?.startsWith("#")) {
                setIndexSearch("tags");
              } else if (e.target?.value?.startsWith("$")) {
                setIndexSearch("coins");
              } else if (e.target?.value?.startsWith(":")) {
                setIndexSearch("stories");
              }
              if (e.target?.value?.endsWith("^")) {
                setIndexSearch("companies");
              }
            }}
          />
      
      </div>
      {isURL(searchState?.query) && (
        <div style={{display: "flex", alignItems: "center"}}>
          <p>Should we embed this url? </p>
          <input onChange={() => setEmbed(!embed)} className="switch" type="checkbox" id="switch" />
        </div>
      )}
      <div style={{display: "flex", gap: "5px"}}>
        <button onClick={e => handleAddUrl(e, {url: searchState?.query})} className="link-button">
          {embed ? "Embed Link" : "Set Link"}
        </button>
        {link?.length > 0 && (
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (deleteUrl) {
                deleteUrl();
              }
            }}
            className="link-button"
          >
            Delete Link
          </button>
        )}
      </div>

      {embed && isURL(searchState?.query) && (
        <div>
          <p>Preview:</p>
          {/* <HackerNoonEmbeds attrs={{href: searchState?.query}} /> */}
        </div>
      )}
    </Wrapper>
  );
};

export default QuillLink;
