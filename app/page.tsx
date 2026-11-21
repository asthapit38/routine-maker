import { legacyMarkup, legacyScriptSrc } from './legacy';

export default function Home() {
  return (
    <>
      {/* The legacy script fills this markup in before React hydrates. */}
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: legacyMarkup }} />
      {/* A plain blocking script: it runs once while the page is parsed, right
          after the markup, as the inline script does in index.html. */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src={legacyScriptSrc} />
    </>
  );
}
