import { expect, open, test } from "nsh/test";

test("shows the topic list", async () => {
  const app = await open("./App.tsx");
  await app.waitFor("Lastbook");
  expect(app.texts()).toContain("Get safe drinking water");
});
