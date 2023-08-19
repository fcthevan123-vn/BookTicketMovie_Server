class UsersController {
  index(req, res, next) {
    res.send("test index");
  }
  testUsers(req, res, next) {
    res.send("all users here");
  }
  about(req, res, next) {
    res.send("about");
  }
}

export default new UsersController();
