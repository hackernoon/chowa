import React, {useCallback, useContext, useState, useEffect, useRef} from "react";
import _ from "lodash";
import Textarea from "react-textarea-autosize";
import styled from '@emotion/styled';

const Container = styled.div`
  min-width: 350px;
  transition: transform 0.5s ease-in-out;
  display: none;
  &.slide-in {
    display: block;
    transform: translateX(80px);
    animation: ani 0.5s forwards;
  }

  &.slide-out {
    transform: translateX(0px);
    animation: out 0.5s forwards;
  }

  &.comments-only {
    // height: 700px;
    height: 100vh;
    // bottom: 10%;
    overflow: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    // .comment-text {
    //   width: 100%;
    //   min-height: 100px;
    //   font-size: 16px;
    // }
  }

  .close-btn-wrapper {
    display: flex;
    button {
      width: 100%;
      margin: 5px 15px;
      border: 1px solid #ffffff;
      border-radius: 5px;
      background: #f9bebe;
      padding: 5px;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .comment-text {
    font-size: 15px;
  }
  .already-comments {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px 15px;
    &.new {
    }
    .already-comment {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #cecece;
      position: relative;
      overflow: unset;
      .commenter-wrapper {
        width: 30px;
        height: 30px;
        position: absolute;
        right: -15px;
        top: -15px;
        .commenter-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .text {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
      }
      .hightlightedText {
        padding-left: 15px;
        border-left: 2px solid lime;
      }
    }
    &.replies {
      margin-left: 15px;
    }
  }

  .comment-text {
    width: 100%;
    min-height: 100px;
  }

  /* Close button */
  .popup-button {
    background-color: #5a3d96;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    // margin-top: 10px;
    // display: flex;
    // justify-self: center;
    // justify-content: center;
  }

  @keyframes ani {
    0% {
      opacity: 0;
    }
    // 1% {
    //   display: flex;
    // }
    // 50% {
    //   opacity: 1; /* Make it visible */
    // }
    100% {
      opacity: 1; /* Fade out */
      transform: translateX(0);
    }
  }

  @keyframes out {
    0% {
      display: block;
      opacity: 0.8;
    }

    100% {
      opacity: 0;
      transform: translateX(120px);
      display: none;
    }
  }
`;

const AlreadyComment = ({item, handleAddComment, scrollToText, connectedUsers = {}}) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [showHighlightedText, setShowHighlightedText] = useState(false);

  return (
    <div className="already-comment">
      {item?.owner?.avatar && (
        <div
          className="commenter-wrapper"
          onClick={() => window && window.open(`https://hackernoon.com/u/${item?.owner?.handle}`, "_blank")}
        >
          <img className="commenter-avatar" src={item?.owner?.avatar} alt />
        </div>
      )}
      <p>
        <span style={{color: "#616161", fontSize: "13px"}}>
          {new Date(item?.time).toLocaleDateString()}
        </span>{" "}
        by @
        <a style={{color: "#000000"}} href={`https://hackernoon.com/u/${item?.owner?.handle}`}>
          {item?.owner?.handle}
        </a>
        {/* on {new Date(item?.time).toLocaleDateString()} */}
      </p>
      <p
        className="text"
        onClick={() => item?.hightlightedText && setShowHighlightedText(!showHighlightedText)}
        style={
          connectedUsers?.length > 0
            ? {background: connectedUsers?.filter(({userId}) => userId === item?.owner?.id)[0]?.color || "#ffd589"}
            : {background: item?.replyId ? "#98ff89" : "#ffd187"}
        }
      >
        {item?.text}
      </p>
      {showHighlightedText && (
        <p className="hightlightedText" onClick={() => scrollToText && scrollToText(item)}>
          <i>{item?.hightlightedText}</i>
        </p>
      )}
      {item?.replies?.length > 0 && (
        <>
          <div className="already-comments replies">
            {item?.replies.map(item => (
              <AlreadyComment key={item?._id} item={item} handleAddComment={handleAddComment} />
            ))}
          </div>
        </>
      )}
      <div>
        {!item.replyId && (
          <>
            <div style={{margin: "15px 0px"}}>
              <Textarea
                placeholder="Add your reply here..."
                data-gramm_editor="false"
                // style={{width: "100%", height: "145px"}}
                className="comment-text"
                name="title"
                onChange={e => setText(e.target.value)}
                value={text}
              />
            </div>
            <button
              onClick={() => {
                if (!text) {
                  return;
                }
                if (handleAddComment) {
                  setSaving(true);
                  handleAddComment(text, item?._id).then(() => {
                    setSaving(false);
                    setText("");
                  });
                }
              }}
              className="popup-button"
            >
              {saving ? (
                <img src="https://hackernoon.com//watch-gif.gif" width={20} alt="saving" className="loading-logo" />
              ) : (
                "Add Reply"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CommentsPopup = ({
  show,
  showOtherComments,
  handleAddComment,
  close,
  comments = [],
  scrollToText,
  connectedUsers,
}) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const elementRef = useRef(null);

  // const handleClickOutside = event => {
  //   if (elementRef.current && !elementRef.current.contains(event.target)) {
  //     if (close) {
  //       close();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Add event listener when the component mounts
  //   document.addEventListener("mousedown", handleClickOutside);
  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // console.log("rendering comments");
  return (
    <Container
      className={`${show ? "slide-in" : "slide-out"} ${
        comments?.length > 0 && showOtherComments ? "comments-only" : ""
      }`}
      ref={elementRef}
    >
      {comments?.length > 0 && showOtherComments ? (
        <>
          <div className="close-btn-wrapper">
            <button onClick={() => close()}>Close</button>
          </div>
          <div className="already-comments">
            {comments?.map(item => (
              <AlreadyComment
                key={item?._id}
                item={item}
                handleAddComment={handleAddComment && handleAddComment}
                scrollToText={scrollToText}
                connectedUsers={connectedUsers}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="already-comments new">
          <h2 style={{margin: "5px 0px"}}>Enter Your Comment</h2>
          <div>
            <Textarea
              maxLength={100}
              // minRows={1}
              // maxRows={10}
              placeholder="add your comment..."
              data-gramm_editor="false"
              // style={{width: "100%", height: "145px"}}
              className="comment-text"
              autoFocus
              name="title"
              onChange={e => setText(e.target.value)}
              value={text}
            />
          </div>
          <button
            onClick={() => {
              if (!text) {
                return;
              }
              if (handleAddComment) {
                setSaving(true);
                handleAddComment(text).then(() => {
                  setSaving(false);
                  setText("");
                });
              }
            }}
            className="popup-button"
          >
            {saving ? (
              <img src="https://hackernoon.com//watch-gif.gif" width={25} alt="saving" className="loading-logo" />
            ) : (
              "Add Comment"
            )}
          </button>
        </div>
      )}
    </Container>
  );
};

export default CommentsPopup;
