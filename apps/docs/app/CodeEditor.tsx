"use client";

import { githubLight } from "@uiw/codemirror-theme-github";
import { useState } from "react";
import { Editor } from "yet-another-live-editor";

export default function CodeEditor() {
  let [code, setCode] = useState(`import React from "react";

export default function App() {
  return <marquee>Hello world!</marquee>;
}`);

  return (
    <Editor
      theme={githubLight}
      code={code}
      onChange={setCode}
    />
  );
}
