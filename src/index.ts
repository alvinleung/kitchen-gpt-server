import express, { Request, Response } from "express";
import inquirer from "inquirer";

// const app = express();
// const port = 10000;

// app.get("/", (req: Request, res: Response) => {
//   res.json({ greeting: "Hello world!" });
// });

// app.listen(port, () => {
//   console.log(`🚀 server started at http://localhost:${port}`);
// });

(async () => {
  while (true) {
    const ans = await inquirer.prompt([
      { type: "input", name: "ans", message: "hello?" },
    ]);
  }
})();
