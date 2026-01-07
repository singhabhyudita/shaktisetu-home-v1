describe("supabaseClient", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should initialize supabase client", () => {
    jest.isolateModules(() => {
      process.env.REACT_APP_SUPABASE_URL = "https://example.supabase.co";
      process.env.REACT_APP_SUPABASE_ANON_KEY = "anon-key";

      const mod = require("../supabaseClient");
      expect(mod.supabase).toBeDefined();
    });
  });

  it("should log error if env variables are missing", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => { });

    jest.isolateModules(() => {
      delete process.env.REACT_APP_SUPABASE_URL;
      delete process.env.REACT_APP_SUPABASE_ANON_KEY;

      const mod = require("../supabaseClient");
      expect(mod.supabase).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Supabase configuration missing!",
      );
    });

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});
