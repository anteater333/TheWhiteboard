import Router from "../Router";

class ApiRoute extends Router {
  public baseRoute = "/api";

  public routes() {
    this.router.get("/", (req, res) => {
      return res.json({ hello: "world" });
    });
  }
}

export default new ApiRoute();
