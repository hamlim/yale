"use client";

import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { Component, useCallback, useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <div>{JSON.stringify(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

function hackImport(url: string) {
  let fun = new Function("url", `return import(url)`);

  return fun(url);
}

async function esm<Mod>(t: TemplateStringsArray, ...r: Array<any>): Promise<Mod> {
  let e = String.raw({ raw: t }, ...r);
  let res = await fetch("https://esm.sh/build", {
    method: "POST",
    body: JSON.stringify({ source: e }),
    headers: { "Content-Type": "application/json" },
  });

  let { bundleUrl } = await res.json() as { bundleUrl: string };
  return hackImport(bundleUrl);
}

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: Timer | null = null;
  return function(...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, ms);
  } as T;
}

function Renderer({ code }: { code: string }) {
  let [res, setRes] = useState<null | { render: ComponentType }>(null);

  let setResult = useCallback(
    debounce((code) => {
      esm<{ default: ComponentType }>`${code}`.then(({ default: render }: { default: ComponentType }) => {
        setRes({ render });
      });
    }, 500),
    [],
  );

  useEffect(() => {
    let active = true;

    setResult(code);

    return () => {
      active = false;
    };
  }, [code]);

  if (!res) return <div>Loading...</div>;

  return (
    <ErrorBoundary>
      <res.render />
    </ErrorBoundary>
  );
}

export type EditorProps = {
  code: string;
  onChange: (code: string) => void;
} & Omit<ReactCodeMirrorProps, "value">;

export function Editor({
  code,
  onChange,
  ...props
}: EditorProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <CodeMirror
        value={code}
        onChange={onChange}
        extensions={[javascript({ jsx: true })]}
        {...props}
      />
      <Renderer code={code} />
    </div>
  );
}
