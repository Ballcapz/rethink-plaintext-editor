import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import css from "./style.css";
import { debounce } from "../../lib/debounce";

import { TrixEditor } from "react-trix";

function PlaintextEditor({ file, write }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      setValue(await file.text());
      setIsLoading(false);
    })();
  }, [file]);

  const handleEditorReady = (editor) => {
    editor.insertString(value);
  };

  const handleChange = (html, text) => {
    setValue(text);

    debounce(handleSave(), 1000);
  };

  const handleSave = () => {
    const newFile = new File([value], file.name, {
      type: "text/plain",
      lastModified: new Date(),
    });
    write(newFile);
  };

  return (
    <>
      <div className={css.editor}>
        {isLoading ? (
          <h3>Loading</h3>
        ) : (
          <>
            <TrixEditor
              onChange={handleChange}
              onEditorReady={handleEditorReady}
            />
            <button type="submit" onClick={handleSave}>
              Save Changes
            </button>
          </>
        )}
      </div>
    </>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func,
};

export default PlaintextEditor;
