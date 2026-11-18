import { expect, open, test } from "nsh/test";

test("lists topics, opens one, goes back", async () => {
  const app = await open("./App.tsx");
  await app.waitFor("Get safe drinking water");
  await app.press("Get safe drinking water");
  await app.waitFor("What's happening?");
  expect(app.texts()).toContain("Limits");
  await app.press("‹ Semua topik");
  await app.waitFor("Get safe drinking water");
});
