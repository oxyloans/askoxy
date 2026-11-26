import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, seoConfig } from "./seoConfig";

export function captureSEO() {
  const selector =
    'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]';

  const title = document.title;

  const original = Array.from(
    document.head.querySelectorAll(selector)
  ).map((el) => el.cloneNode(true));

  return () => {
    document.title = title;

    document.head
      .querySelectorAll(selector)
      .forEach((el) => el.remove());

    original.forEach((el) =>
      document.head.appendChild(el)
    );
  };
}

function meta(
  attribute: "name" | "property",
  key: string,
  value: string
) {
  let el =
    document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${key}"]`
    );

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }

  el.content = value;
}

export default function DynamicSEO({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();

  const path =
    pathname.replace(/\/+$/, "").toLowerCase() || "/";

  useEffect(() => {
    const seo = seoConfig[path];

    if (!seo) return;

    const restore = captureSEO();
    const url = BASE_URL + path;

    document.title = seo.title;

    meta("name", "description", seo.description);

    meta("property", "og:title", seo.title);
    meta("property", "og:description", seo.description);
    meta("property", "og:url", url);
    meta("property", "og:type", "website");
    meta("property", "og:site_name", "ASKOXY.AI");

    meta("name", "twitter:title", seo.title);
    meta("name", "twitter:description", seo.description);

    let canonical =
      document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = url;

    return restore;
  }, [path]);

  return <>{children}</>;
}