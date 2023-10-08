import { useState } from "react";

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import copy from "copy-text-to-clipboard";
import { Prism as PrismSyntaxHighlighter } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";

function SyntaxHighlighter({ language, name = "", ...props }: any) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyCode = () => {
    copy(props.children);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const regex = /\\n/g;
  return (
    <div className="h-96 relative">
      {name && (
        <div
          className={`-mb-3 bg-gray-900 pb-2 flex ${
            name ? "justify-between" : "justify-end"
          }`}>
          {name && (
            <span className="px-2 py-2 text-xs font-bold text-gray-300 block">
              {name}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyCode}
            className="rounded-md  px-4 text-xs text-white">
            {showCopied ? (
              "Copied"
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {!name && (
        <button
          type="button"
          onClick={handleCopyCode}
          className="right-0 top-2 rounded-md px-4 text-xs text-white absolute">
          {showCopied ? (
            "Copied"
          ) : (
            <DocumentDuplicateIcon className="h-4 w-4" />
          )}
        </button>
      )}

      <PrismSyntaxHighlighter
        style={codeStyle}
        language={language}
        {...props}
        wrapLines
        className="h-96 overflow-auto">
        {props.children.replace(regex, "\n")}
      </PrismSyntaxHighlighter>
    </div>
  );
}

export default SyntaxHighlighter;
