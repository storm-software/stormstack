import { ConsoleLogger } from "./console-logger";

describe("ConsoleLogger.info", () => {
  it("should run successfully", () => {
    expect(ConsoleLogger.info("Test Message")).toEqual(undefined);
  });
});

describe("ConsoleLogger.warn", () => {
  it("should run successfully", () => {
    expect(ConsoleLogger.warn("Test Message")).toEqual(undefined);
  });
});

describe("new ConsoleLogger().success", () => {
  it("should run successfully", () => {
    expect(new ConsoleLogger().success("Test Message")).toEqual(undefined);
  });
});

describe("new ConsoleLogger().info", () => {
  it("should run successfully", () => {
    expect(new ConsoleLogger().info("Test Message")).toEqual(undefined);
  });
});

describe("new ConsoleLogger().warn", () => {
  it("should run successfully", () => {
    expect(new ConsoleLogger().warn("Test Message")).toEqual(undefined);
  });
});

describe("new ConsoleLogger().success", () => {
  it("should run successfully", () => {
    expect(new ConsoleLogger().success("Test Message")).toEqual(undefined);
  });
});
