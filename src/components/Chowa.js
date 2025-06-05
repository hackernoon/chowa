import React, { useState, useRef, useMemo } from 'react'

import ReactQuill, {Quill} from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Toolbar from "./Toolbar.jsx";
import CommentsPopup from './CommentsPopup.js';
import styled from '@emotion/styled';

const Layout = styled.div(`
  &.more-length{
    max-width: 1350px;
  }

  .draft-types{
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    .type-item{
      padding: 5px 15px;
      border-radius: 5px;
      color: #ffffff;
      display: flex;
      gap: 5px;
      align-items: center;
      &.debut{
        background: #138A36;
        svg path {fill: #ffffff;}
      }
      &.notDebutting{
        background: #76A9FA;
        color: #000000;
      }
      &.firstSeenAt{
        background:rgb(207, 207, 207);
        color: #000000;
      }
      &.backlink{
        background: #31C48D;
        color: #000000;
      }
    }
  }
  .ql-toolbar{
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    position: sticky;
    // top: 140px;
    z-index: 1;
    background: #ffffff;
  }
  .quill {
    height: 100%;
    width: 100%;
    &.left-move{
      margin-left: -190px;
      // width: max-content;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  .ql-clipboard {
    position: fixed !important;
    left: 50% !important;
    top: 50% !important;
    opacity: 0;
  }
  .ql-container {
    background: #ffffff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 100%;
    padding: 22px 18px;
    .ql-editor{
      font-size: 16px;
      line-height: 1.7em;
      padding: 0;
      a {
        cursor: pointer;
      }
      strong, em, u, s {
        pointer-events: none;
      }
      img{ 
        height: 300px;
        margin: 0 auto;
        display: block;
      }
      .ql-embedable{
        text-align: -webkit-center;
      }
      ol, ul{
        padding-left: 0px;
      }
      blockquote{
        border-left: 4px solid #6aff00;
      }
     .notice {
        border-radius: 5px;
        padding: 8px 16px;
        margin: 8px 0px;
        font-weight: 600;
        &.notice-info{
          background: rgb(245, 190, 49);
          color: rgb(33, 36, 40);
        }
        &.notice-warning{
          background: rgb(255, 92, 128);
          color: rgb(255, 255, 255);
        }
        &.notice-tip{
          background: #62ff86 !important;
          color: black !important;
        }
      }
   
    }
  }

  .excerpt, .tldr, .comment-text, .other-rejection{
    height: 95px;
    resize: none;
    background: #eee;
    border: beige;
    padding: 10px;
    border-radius: 5px;
    font-size: 18px;
  }

  .editing-noti{
    display: flex;
    align-items: center;
    margin: 20px 0;
    background: #8bff00;
    padding: 10px;
    border-radius: 5px;
    .actions{
      display: flex;
      gap: 10px;
      margin: 0 10px;
    }
  }
  .comments-container{
    text-align: center;
    position: absolute;
    right: 25px;
    width: 300px;
    text-align: center;
    .comments{
      display: flex;
      flex-direction: column;
      gap: 10px;
      .comment{
        background: #ffe1c9;
        padding: 10px;
        border-radius: 5px;
      }
    }
  }
  .comment-button{
    background: #5e5e5e !important;
    width: 80px !important;
    border-radius: 5px;
    color: #ffffff;
    font-weight: 600;
    &:hover{
      color: lime !important;
    }
  }
  .main-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    cursor: pointer;
    border: 2px dashed #dcdcdc;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .draft-title {
    background: transparent;
    width: 100%;
    padding: 8px 0;
    font-size: 36px;
    font-weight: bold;
    border: none;
  }

  .input-btn{
    border: 1px solid #b9b9b9;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 15px;
    color: #ffffff;
    cursor: pointer;
    &.access{
      background: #1d5f00;
    }
    &.save{
      background: #56029e;
      width: 100px;
      margin: 0 10px;
    }
  }

  .inputs{
    display: flex;
    gap: 10px;  
    margin: 20px 0;
    .input{
      display: flex;
      gap: 5px;  
      .user-id-input{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #c0c0c0;
      }
    }
  }

`);

const Block = Quill.import("blots/block");

const createDynamicNoticeBlock = blotName => {
  class NoticeBlock extends Block {
    static create() {
      const node = super.create();
      node.classList.add(`notice`);
      return node;
    }
  }

  NoticeBlock.blotName = `notice-${blotName}`;
  NoticeBlock.tagName = "div";
  NoticeBlock.className = `notice-${blotName}`;
  Quill.register({
    [`formats/notice-${blotName}`]: NoticeBlock,
  });
};

["info", "tip", "warning"].forEach(name => createDynamicNoticeBlock(name));

const Chowa = () => {
  const quillRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [formats, setFormats] = useState({});
  const [showLinkOnShortCut, setShowLinkOnShortCut] = useState(false);
  const [commentRange, setCommentRange] = useState(null);


  const handleSelectionChange = (range, oldRange, source) => {
    if (range && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentFormats = quill.getFormat(range.index, range.length);
      setFormats(currentFormats);
    }
  };

  const applyFormat = (name, data) => {
    const editor = quillRef?.current?.getEditor();
    if (editor) {
      const value = editor.getSelection();
      var format = editor?.getFormat();
      // console.log(name, value, format );
      const basicFormats = ["bold", "italic", "underline", "strike", "link", "code-block", "blockquote"];

      if (basicFormats.includes(name)) {
        if (!format[name]) {
          setFormats(prev => ({...prev, [name]: true}));
        } else {
          setFormats(prev => ({...prev, [name]: false}));
        }
      }
      if (name === "bold") {
        if (!format["bold"]) editor.format("bold", value?.index, "user");
        else editor.format("bold", false, "user");
      } else if (name === "italic") {
        if (!format["italic"]) editor.format("italic", value?.index, "user");
        else editor.format("italic", false, "user");
      } else if (name === "underline") {
        if (!format["underline"]) editor.format("underline", value?.index, "user");
        else editor.format("underline", false, "user");
      } else if (name === "strike") {
        if (!format["strike"]) editor.format("strike", value?.index, "user");
        else editor.format("strike", false, "user");
      } else if (name === "header-2") {
        if (format["header"] && format["header"] === 2) {
          editor.removeFormat(value?.index, value?.length, "user");
          setFormats(prev => ({...prev, ["header"]: null}));
        } else {
          editor.formatLine(value?.index, value?.length, "header", 2, "user");
          setFormats(prev => ({...prev, ["header"]: 2}));
        }
      } else if (name === "header-3") {
        if (format["header"] && format["header"] === 3) editor.removeFormat(value?.index, value?.length, "user");
        else editor.formatLine(value?.index, value?.length, "header", 3, "user");
      } else if (name === "normal") {
        editor.removeFormat(value?.index, value?.length, "user");
      } else if (name === "image" && data) {
        editor.insertEmbed(value?.index, "image", data, "user");
      } else if (name === "link" && data) {
        if (value?.length === 0) {
          editor.insertText(value?.index, data?.label || data?.url, "link", data?.url, "user");
        } else {
          editor.format("link", data?.url, "user");
        }
      } else if (name === "delete-link") {
        if (format["link"]) {
          editor.format("link", false, "user");
        }
      } else if (name === "embed-link" && data) {
        editor.insertEmbed(value?.index, "embedable", data, "user");
      } else if (name === "ordered-list") {
        if (format["list"] && format["list"] === "ordered") {
          editor.removeFormat(value?.index, value?.length, "user");
          setFormats(prev => ({...prev, ["list"]: null}));
        } else {
          editor.formatLine(value?.index, value?.length, "list", "ordered", "user");
          setFormats(prev => ({...prev, ["list"]: "ordered"}));
        }
      } else if (name === "unordered-list") {
        if (format["list"] && format["list"] === "bullet") {
          editor.removeFormat(value?.index, value?.length, "user");
          setFormats(prev => ({...prev, ["list"]: null}));
        } else {
          editor.formatLine(value?.index, value?.length, "list", "bullet", "user");
          setFormats(prev => ({...prev, ["list"]: "bullet"}));
        }
      } else if (name === "indent-right") {
        if (!format["indent"] || format["indent"] < 2) {
          editor.format("indent", "+1", "user");
          setFormats(prev => ({...prev, ["indent"]: 1}));
        }
      } else if (name === "indent-left") {
        if (format["indent"]) {
          editor.format("indent", "-1", "user");
        }
      } else if (name === "code-block") {
        if (format["code-block"]) editor.removeFormat(value?.index, value?.length, "user");
        else editor.format("code-block", value?.index, "user"); //editor.formatText(value?.index, value?.length, 'code-block');
      } else if (name === "blockquote") {
        if (!format["blockquote"]) editor.format("blockquote", value?.index, "user");
        else editor.format("blockquote", false, "user");
      } else if (name === "notice-info") {
        if (!format[`notice-info`]) editor.formatLine(value?.index, value?.length, `notice-info`, true, "user");
        else editor.removeFormat(value?.index, value?.length, "user");
      } else if (name === "notice-warning") {
        if (!format[`notice-warning`]) editor.formatLine(value?.index, value?.length, `notice-warning`, true, "user");
        else editor.removeFormat(value?.index, value?.length, "user");
      } else if (name === "notice-tip") {
        if (!format[`notice-tip`]) editor.formatLine(value?.index, value?.length, `notice-tip`, true, "user");
        else editor.removeFormat(value?.index, value?.length, "user");
      } else if (name === "clear" && value) {
        editor.removeFormat(value?.index, value?.length, "user");
      }
    }
  };


  const modules = useMemo(
    () => ({
      toolbar: false,
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const editorToolbar = useMemo(() => {
    return (
      <Toolbar
        applyFormat={applyFormat}
        toggleComments={() => setShowComments(!showComments)}
        handleImage={() => null}
        applyFocus={() => quillRef?.current && quillRef?.current?.focus()}
        showLinkOnShortCut={showLinkOnShortCut}
        setShowLinkOnShortCut={setShowLinkOnShortCut}
        currentFormats={formats}
        getLink={() => {
          if (quillRef?.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (range) {
              var selectedContent = quill.getContents(range.index, range.length);
              if (selectedContent?.ops[0]?.attributes?.link) {
                return selectedContent?.ops[0]?.attributes?.link;
              }
            }
          }
        }}
      />
    );
  }, [formats, quillRef?.current, showLinkOnShortCut, applyFormat]);

  const commetsPopup = useMemo(() => {
    return (
      <CommentsPopup
        comments={[]}
        showOtherComments={commentRange === null}
        show={showComments}
        close={() => setShowComments(false)}
        handleAddComment={() => null}
        scrollToText={data => {
          if (quillRef?.current && data?.range) {
            const quill = quillRef?.current?.getEditor();
            quill.setSelection(data?.range?.start, data?.range?.end, "api");
          }
        }}
      />
    );
  }, [showComments, commentRange]);

  // console.log("heree", editorToolbar)

  return (
    <Layout>

      {editorToolbar}

      <div
        style={{height: "500px", width: "100%", position: "relative", display: "flex", gap: "10px"}}
      >

        <ReactQuill
          // theme='snow'
          className={showComments ? "left-move" : ""}
          ref={quillRef}
          onChangeSelection={handleSelectionChange}
          preserveWhitespace={true}
          placeholder="write something nice..."
          modules={modules}
        />
        {commetsPopup}
      </div>

    </Layout>
  )
}

export default Chowa
