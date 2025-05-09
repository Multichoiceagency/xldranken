const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // 🔐 Redirect HTTP to HTTPS in production
      if (!dev && req.headers["x-forwarded-proto"] !== "https") {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`,
        })
        res.end()
        return
      }

      // 🌐 CORS headers - Allow both production and development origins
      const allowedOrigins = ["https://xlgroothandelbv.nl", "http://localhost:8080", "http://localhost:3000"]

      const origin = req.headers.origin
      if (allowedOrigins.includes(origin) || dev) {
        res.setHeader("Access-Control-Allow-Origin", origin || "*")
      } else {
        res.setHeader("Access-Control-Allow-Origin", "https://xlgroothandelbv.nl")
      }

      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
      res.setHeader("Access-Control-Allow-Credentials", "true")

      // Handle preflight
      if (req.method === "OPTIONS") {
        res.statusCode = 204
        res.end()
        return
      }

      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === "/a") {
        await app.render(req, res, "/a", query)
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http${dev ? "" : "s"}://${hostname}:${port}`)
    })
})
