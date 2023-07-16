import { useState } from "react";
import SyntaxHighlighter from "../../components/SyntaxHighlighter";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface ExampleProps {
  title?: string;
  description?: string;
  examples: any;
  showLineNumbers?: boolean;
}

function Examples({
  title = "Examples",
  description,
  examples = [],
  showLineNumbers,
}: ExampleProps) {
  const tabs = examples.map((example, index) => ({
    name: example.name || `Example ${index + 1}`,
    content: example.snippet,
    description: example.description,
    langugage: example.langugage,
  }));

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabSelection = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="examples my-5">
      <div className="">
        <h2 className="text-lg font-medium text-gray-700 underline">{title}</h2>
        {description && (
          <p className="text-md font-medium text-gray-700">{description}</p>
        )}

        <div>
          <div className="col-span-5">
            <nav
              className="-mb-2 flex w-full overflow-hidden overflow-x-scroll bg-gray-900"
              aria-label="Tabs">
              {tabs.map(tab => {
                const isSelected = tab.name === selectedTab.name;
                return (
                  <button
                    type="button"
                    key={tab.name}
                    onClick={() => handleTabSelection(tab)}
                    className={classNames(
                      isSelected
                        ? "selected border-yellow-300 bg-gray-700 text-yellow-300"
                        : "border-transparent bg-gray-800 text-gray-500 hover:text-gray-400  ",
                      "important:no-underline whitespace-nowrap border-b-2 px-6 py-3 text-xs font-medium  transition "
                    )}
                    aria-current={isSelected ? "page" : undefined}>
                    {tab.name}
                  </button>
                );
              })}
            </nav>
            <div>
              <SyntaxHighlighter
                language={selectedTab.langugage}
                showLineNumbers={showLineNumbers}>
                {selectedTab.content}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Examples;
