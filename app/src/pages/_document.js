import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="synthwave">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            defer
            src="https://api.pirsch.io/pa.js"
            id="pianjs"
            data-code="WA2CHA4eqxYLIM8qvR1a51TSAiNMM87H"
          />
        </>
      )}
    </Html>
  );
}
