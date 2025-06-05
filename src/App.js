import React, { useEffect, useState, useRef, useMemo } from 'react'

import "react-quill-new/dist/quill.snow.css";
import Chowa from './components/Chowa.js';
import "./app.scss";

const App = () => {

  return (
    <div>
      <div className="miro-shape miro-circle"></div>
      <div className="miro-shape miro-square"></div>
      <div className="miro-shape miro-line"></div>

      <header>
        <div className="container">
          <div className="logo">
            <h1>CHOWA.tech</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="editor-section">
          <div className="container">
            <div className="editor-container pixel-border">

              <Chowa />


              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button className="pixel-button">
                  <a href="https://app.hackernoon.com/articles/new" target='_blank'>
                    Start Collaborating Now
                  </a>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="features">
              <div className="feature-card">
                <h3>Real-Time Collaboration</h3>
                <p>Write together with multiple authors simultaneously. See changes as they happen with no lag or conflicts.
                </p>
              </div>
              <div className="feature-card">
                <h3>AI Assistance</h3>
                <p>Work alongside AI collaborators that can help with research, editing, and creative suggestions.</p>
              </div>
              <div className="feature-card">
                <h3>Seamless Integration</h3>
                <p>Fully integrated with HackerNoon's publishing platform and The Editing Protocol.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <h2>Chōwa: Between Structure and Freedom</h2>
            <p>Chōwa (調和, choh-wah, /ˈt͡ʃoːwa/) — rhymes with flow-a — is a collaborative text editor built on Quill and
              integrated with HackerNoon and The Editing Protocol.</p>

            <p>After months of ideation and development, we're introducing your new favorite writing tool: Chowa, the
              collaborative text editor built for real-time teamwork. This is your space to start a blank draft and enjoy
              seamless collaboration—with support for multiple authors.</p>

            <p>Chowa brings together structure and freedom, allowing writers to collaborate in harmony. With real-time
              updates, commenting features, and integrated publishing workflows, Chowa makes the writing process more
              transparent and efficient.</p>

            <p>The editor supports rich text formatting including bold, italic, underline, lists, code blocks, quotes, and
              info notices. You can also add links, media, and leave comments for your co-authors to maintain clear
              communication throughout the writing process.</p>

            <p>When your piece is ready for publication, simply complete your Story Settings and submit for review. All
              co-authors' names will appear on both the story board and story page when your work goes live.</p>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>Start Writing Together</h2>
            <p>Your words matter. Your stories fuel conversations, ideas, and communities. Collaborate with others and
              create something extraordinary.</p>
            <button className="pixel-button">
              <a href="https://app.hackernoon.com/articles/new" target='_blank'>
                Get Started with Chowa
              </a>
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>© 2025 Chowa.tech | A HackerNoon Project</p>
        </div>
      </footer>

    </div>
  )
}

export default App
