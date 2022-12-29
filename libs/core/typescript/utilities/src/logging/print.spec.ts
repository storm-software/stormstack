import { printInfo, printSuccess, printWarning } from "./print";

describe("printInfo", () => {
  it("should run successfully", () => {
    expect(printInfo("Test Message")).toEqual(undefined);
  });
});

describe("printWarning", () => {
  it("should run successfully", () => {
    expect(printWarning("Test Message")).toEqual(undefined);
  });
});

describe("printSuccess", () => {
  it("should run successfully", () => {
    expect(printSuccess("Test Message")).toEqual(undefined);
  });
});
