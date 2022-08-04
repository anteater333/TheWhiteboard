import Express from "express";
import { PORT } from "./utils/config";

export default class Server {
  private app: Express.Application;
  private port: number | string;

  constructor() {
    this.port = PORT;
    this.app = Express();
  }

  private plugins() {
    // middlewares
    // this.app.use(Express.json());
    // this.app.use(Express.urlencoded({ extended: true }));
    // this.app.use(Cors());
    // this.app.use(Routes);
  }

  public run() {
    try {
      this.plugins();
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

new Server().run();
