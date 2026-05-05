export default function SocialEmbed() {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              margin: 0;
              background: black;
            }
          `}
        </style>
      </head>
      <body>
        <div
          className="juicer-feed"
          data-feed-id="trey-lance"
        ></div>

        <script
          src="https://www.juicer.io/embed/trey-lance/embed-code.js"
          async
        ></script>
      </body>
    </html>
  );
}