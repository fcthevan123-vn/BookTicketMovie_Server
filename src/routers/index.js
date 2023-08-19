import usersRouter from "./usersRouter";

const route = (app) => {
  // app.use("/api/v1/user", usersRouter);
  app.use("/", usersRouter);
};

export default route;
