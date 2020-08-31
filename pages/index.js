import React, { useState, useEffect } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import path from "path";
import classNames from "classnames";

import { listFiles } from "../lib/list-files";

// Used below, these need to be registered
import MarkdownEditor from "../MarkdownEditor";
import PlaintextEditor from "../components/PlaintextEditor";

import IconPlaintextSVG from "../public/icon-plaintext.svg";
import IconMarkdownSVG from "../public/icon-markdown.svg";
import IconJavaScriptSVG from "../public/icon-javascript.svg";
import IconJSONSVG from "../public/icon-json.svg";

import css from "./style.module.css";

import Prism from "prismjs";

const TYPE_TO_ICON = {
  "text/plain": IconPlaintextSVG,
  "text/markdown": IconMarkdownSVG,
  "text/javascript": IconJavaScriptSVG,
  "application/json": IconJSONSVG,
};

function FilesTable({ files, activeFile, setActiveFile }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ""
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type],
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func,
};

const REGISTERED_PREVIEWER = {
  "text/javascript": "javascript",
  "application/json": "json",
};

function Previewer({ file }) {
  const [value, setValue] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    (async () => {
      setValue(await file.text());
      setType(REGISTERED_PREVIEWER[file.type]);
      Prism.highlightAll();
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>
        <pre>
          <code className={"language-" + type}>{`${value}`}</code>
        </pre>
      </div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object,
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor,
  "text/markdown": MarkdownEditor,
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  const write = (file) => {
    console.log("Writing... ", file.name);
    let newFiles = [...files];
    let fileIdx = newFiles.findIndex((f) => f.name === file.name);
    newFiles[fileIdx] = file;
    setFiles(newFiles);
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
        <script src="https://rawgit.com/basecamp/trix/master/dist/trix.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/trix/1.2.4/trix.min.css"
          integrity="sha512-sC2S9lQxuqpjeJeom8VeDu/jUJrVfJM7pJJVuH9bqrZZYqGe7VhTASUb3doXVk6WtjD0O4DTS+xBx2Zpr1vRvg=="
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/prism.css" />
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Seasoning Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s have fun with files and JavaScript. What could be more fun
            than rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://rethink.software">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
