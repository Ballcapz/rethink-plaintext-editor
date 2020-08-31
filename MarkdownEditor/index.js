import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import MarkdownIt from "markdown-it";

import css from "./style.css";

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function MarkdownEditor({ file, write }) {
  console.log(file, write);

  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      setValue(await file.text());
      setIsLoading(false);
    })();
  }, [file]);

  const handleEditorChange = ({ html, text }) => {
    setValue(text);
  };

  const handleSave = () => {
    const newFile = new File([value], file.name, {
      type: "text/markdown",
      lastModified: new Date(),
    });
    write(newFile);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-markdown-editor-lite/1.2.2/index.min.css"
          integrity="sha512-HX+X7SlAVKdyTPDwS7ir+RFMcgtafaKoYsptU7x/8YHYr3rPtCukgLwjti3/U0iEL+UP3QjdYeyf+Mlw80VB8g=="
          crossOrigin="anonymous"
        />
      </Head>
      <div className={css.editor}>
        {isLoading ? (
          <h3>Loading</h3>
        ) : (
          <MdEditor
            value={value}
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            onBlur={handleSave}
          />
        )}
      </div>
    </>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func,
};

export default MarkdownEditor;
