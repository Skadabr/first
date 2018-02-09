//import ssr from "/app/server/public/ssr";

export default function MiscController(opts) {
  return {
    index(req, resp) {
      //const token = req.user ? req.user.generateJWT() : undefined;
      //const html = ssr(req.url, token);

      resp.send(`<html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
              >
              <meta name="theme-color" content="#000000">
              <link rel="manifest" href="/manifest.json">
              <link rel="shortcut icon" href="/favicon.ico">
              <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossorigin="anonymous"
              >
              <title>React App</title>
          </head>
            <body>
              <noscript>
                You need to enable JavaScript to run this app.
              </noscript>
              <div id="root"></div>
              <script src="/main.js" type="text/javascript"></script>
          </body>
        </html>
      `);
    }
  };
}
