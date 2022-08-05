import Router from "./Router";
import Express from "express";
import ApiRoute from "./Api";

class Routes extends Router {
  public baseRoute = "/";

  public routes() {
    this.router.use(ApiRoute.baseRoute, ApiRoute.router);
  }
}

export default new Routes().router;
