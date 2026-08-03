import { Link } from "react-router-dom";

interface Props {
  categories: string[];
  active: string | null;
  onChange: (domain: string | null) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  const insertAfterIndex = categories.findIndex((cat) =>
    ["ai", "banking", "finance"].includes(cat.toLowerCase())
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none items-center min-w-0">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Link to="/oxynews" className="focus-ring shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-white text-ink-soft hover:bg-royal/10 border border-ink/10 whitespace-nowrap">
          Home
        </Link>
        <Link to="/radhai-news" className="focus-ring shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-white text-ink-soft hover:bg-royal/10 border border-ink/10 whitespace-nowrap">
          RadhAI News
        </Link>
      </div>
      {categories.map((c, idx) => (
        <div key={c} className="flex items-center gap-2">
          <button
            onClick={() => onChange(c)}
            className={`focus-ring shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === c
                ? "bg-royal text-white"
                : "bg-white text-ink-soft hover:bg-royal/10 border border-ink/10"
            }`}
          >
            {c}
          </button>

          {idx === insertAfterIndex && (
            <>
              <button
                onClick={() => onChange("jobs")}
                className={`focus-ring shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active === "jobs"
                    ? "bg-royal text-white"
                    : "bg-white text-ink-soft hover:bg-royal/10 border border-ink/10"
                }`}
              >
                Jobs
              </button>

              <button
                onClick={() => onChange("investment")}
                className={`focus-ring shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active === "investment"
                    ? "bg-royal text-white"
                    : "bg-white text-ink-soft hover:bg-royal/10 border border-ink/10"
                }`}
              >
                Investment
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}