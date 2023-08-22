import { default as apiRouter } from "./api";
const router = (app) => {
  app.use("/api/v1", apiRouter);
  app.use("/", (req, res) => {
    res.send("Book ticket movie");
  });
};

export default router;
