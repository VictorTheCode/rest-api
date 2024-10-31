export function logMiddleware(req: Request) {
  return { res: req.method + " " + req.url };
}
