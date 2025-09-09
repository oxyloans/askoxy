import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

type SearchContextType = {
  query: string;
  setQuery: (v: string) => void;
  debouncedQuery: string;
  setFromUrl: (v: string) => void;
};

const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  debouncedQuery: "",
  setFromUrl: () => {},
});

function useDebounce<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function SearchProvider({ children }: React.PropsWithChildren<{}>) {
  const [query, setQuery] = useState("");
  const [isBoot, setIsBoot] = useState(true);
  const debouncedQuery = useDebounce(query, 250);

  // keep ?q= in URL updated (and restore on boot)
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const initialQ = (usp.get("q") || "").trim();
    if (initialQ) setQuery(initialQ);
    setIsBoot(false);
  }, []);

  useEffect(() => {
    if (isBoot) return;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, [query, isBoot]);

  const setFromUrl = (v: string) => setQuery(v);

  const value = useMemo(
    () => ({ query, setQuery, debouncedQuery, setFromUrl }),
    [query, debouncedQuery]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
