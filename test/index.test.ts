import { Peppol } from "../src/index";

describe("Peppol", () => {
  it("exists", () => {
    const peppol = new Peppol("");
    expect(typeof peppol).toEqual("object");
  });
});
