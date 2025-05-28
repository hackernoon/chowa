import React, { useState, useEffect, useRef } from "react";
import styled from '@emotion/styled';
import QuillLink from "./QuillLink.jsx";
import '@hackernoon/pixel-icon-library/fonts/iconfont.css';

import {
  Comment,
  Code,
  IndentLeft,
  IndentRight,
  BulletList,
  CleanFormat,
  InfoCirlce,
  Star,
  InfoWarning,
} from "./icons";

const Container = styled.div(`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  padding: 8px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
  background: #ffffff;


  // background: #ffcc00 !important;

  button{
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
  }

  .toolbar-icon{
    height: 18px;
  }

  .ql-picker-label{
    color: #000000 !important;
  }

  .active-format{
    background: #9afd7d !important; 
    border-radius: 3px;
  }

  .font-dropdown {
    position: relative;
    width: 130px;
  }

  .dropdown-header {
    padding: 2px 10px;
    // background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-dropdown{
    position: relative;
    .info-dropdown-header {
      padding: 0px 5px;
    }
    .dropdown-list{
      width: 155px;
      li{
        display: flex;
        gap: 5px;
        align-items: center;
      }
    }
  }

  .arrow {
    transition: transform 0.3s ease;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    border-top: none;
    background-color: #fff;
    position: absolute;
    width: 100%;
    z-index: 1;
  }

  .dropdown-list li {
    padding: 5px;
    cursor: pointer;
  }

  .dropdown-list li:hover {
    background-color: #e0e0e0;
  }
  
`);

const Toolbar = ({
  applyFormat,
  toggleComments,
  handleImage,
  applyFocus,
  getLink,
  currentFormats = "",
  showLinkOnShortCut = false,
  setShowLinkOnShortCut,
  hackernoonTouch = true
}) => {
  const [showFont, setShowFont] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [showLinkComponent, setShowLinkComponent] = useState(false);
  const heeaderRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (heeaderRef?.current && !heeaderRef.current.contains(event.target)) {
        setShowFont(false);
      }
      if (infoRef?.current && !infoRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHeader = name => {
    applyFocus();
    applyFormat(name);
    setShowFont(false);
  };

  const handleInfo = name => {
    applyFocus();
    handleInfo(name);
    setShowInfo(false);
  };

  const handleLink = (name, data) => {
    applyFocus();
    applyFormat(name, data);
    setShowLinkComponent(false);
    if (setShowLinkOnShortCut) {
      setShowLinkOnShortCut(false);
    }
  };

  // console.log("re-rendering", showLinkComponent)
  return (
    <Container id="hn-toolbar" className={``}>
        <button>
        <img className="toolbar-icon" src="./hn-icon.png" />
      </button>
      <button className={currentFormats["bold"] ? "active-format" : ""} onClick={() => applyFormat("bold")}>
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/bold-text-icon.svg" />
      </button>
      <button className={currentFormats["italic"] ? "active-format" : ""} onClick={() => applyFormat("italic")}>
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/italic-icon.svg" />
      </button>
      <button className={currentFormats["underline"] ? "active-format" : ""} onClick={() => applyFormat("underline")}>
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/underline-solid.svg" />
      </button>
      <button className={currentFormats["strike"] ? "active-format" : ""} onClick={() => applyFormat("strike")}>
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/strikethrough.svg" />
      </button>
      <button className={currentFormats["comments"] ? "active-format" : ""} onClick={() => toggleComments()}>
        <Comment fill={"#978000"} />
      </button>
      <button onClick={() => handleImage()}>
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/image-solid.svg" />
      </button>
      <div>
        <button
          className={!!currentFormats["link"] === true ? "active-format" : ""}
          onClick={() => setShowLinkComponent(!showLinkComponent)}
        >
          <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/link-solid.svg" />
        </button>
        {(showLinkComponent || showLinkOnShortCut) && (
          <QuillLink
            link={getLink()}
            deleteUrl={() => handleLink("delete-link")}
            addUrl={data => {
              handleLink("link", data);
            }}
            handleEmbed={data => handleLink("embed-link", data)}
            close={() => {
              setShowLinkComponent(false);
              if (setShowLinkOnShortCut) {
                setShowLinkOnShortCut(false);
              }
            }}
          />
        )}
      </div>
      <button onClick={() => applyFormat("indent-right")}>
        <IndentRight style={{width: "16px"}} />
      </button>

      <button
        className={currentFormats["list"] === "ordered" ? "active-format" : ""}
        onClick={() => applyFormat("ordered-list")}
      >
        <img className="toolbar-icon" src="https://hackernoon.imgix.net/mobile/editorMenu/list-ol-solid.svg" />
      </button>
      <button
        className={currentFormats["list"] === "bullet" ? "active-format" : ""}
        onClick={() => applyFormat("unordered-list")}
      >
        {/* <img className='toolbar-icon' src="https://hackernoon.imgix.net/mobile/editorMenu/list-ul-alt-svgrepo-com.svg" /> */}
        <BulletList />
      </button>
      <button className={currentFormats["code-block"] ? "active-format" : ""} onClick={() => applyFormat("code-block")}>
        <Code />
      </button>
      <button className={currentFormats["blockquote"] ? "active-format" : ""} onClick={() => applyFormat("blockquote")}>
        <img
          className="toolbar-icon"
          style={{ height: "15px" }}
          src="https://hackernoon.imgix.net/mobile/editorMenu/quote-right-icon.svg"
        />
      </button>

      <div className="info-dropdown" ref={infoRef}>
        <div className="info-dropdown-header" style={{ padding: "0px" }} onClick={() => setShowInfo(!showInfo)}>
          <button
            style={{ padding: "1px 5px" }}
            className={Object.keys(currentFormats).some(prop => ~prop.indexOf("notice-")) ? "active-format" : ""}
          >
            {currentFormats["notice-warning"] ? (
              <InfoWarning width={16} />
            ) : currentFormats["notice-tip"] ? (
              <Star width={18} />
            ) : (
              <InfoCirlce width={18} />
            )}
          </button>
        </div>
        {showInfo && (
          <ul className="dropdown-list">
            {["Info Notice", "Warning Notice", "Tip Notice"].map((option, i) => (
              <li
                key={option}
                onClick={() => {
                  i === 0 && handleInfo("notice-info");
                  i === 1 && handleInfo("notice-warning");
                  i === 2 && handleInfo("notice-tip");
                }}
              >
                {i === 0 && (
                  <>
                    <InfoCirlce width={20} /> {option}
                  </>
                )}
                {i === 1 && (
                  <>
                    <InfoWarning /> {option}
                  </>
                )}
                {i === 2 && (
                  <>
                    <Star /> {option}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="font-dropdown" ref={heeaderRef}>
        <div className="dropdown-header" onClick={() => setShowFont(!showFont)}>
          {currentFormats["header"] === 2 ? "Heading 2" : currentFormats["header"] === 3 ? "Heading 3" : "normal"}
          <span className={`arrow ${showFont ? "open" : ""}`}>&#9662;</span>
        </div>
        {showFont && (
          <ul className="dropdown-list">
            {["Heading 2", "Heading 3", "normal"].map((option, i) => (
              <li
                key={option}
                onClick={() => {
                  i === 0 && handleHeader("header-2");
                  i === 1 && handleHeader("header-3");
                  i === 2 && handleHeader("normal");
                }}
              >
                {i === 0 && <h2 style={{ margin: 0 }}>{option}</h2>}
                {i === 1 && <h3 style={{ margin: 0 }}>{option}</h3>}
                {i === 2 && option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => applyFormat("clear")}>
        <CleanFormat />
      </button>
    </Container>
  );
};

export default Toolbar;
