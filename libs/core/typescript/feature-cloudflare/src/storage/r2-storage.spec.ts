import { removeR2Async } from "./r2-storage";

describe("removeR2Async", () => {
  it("should work", () => {
    expect(removeR2Async("name", {} as any)).toThrowError();
  });
});
