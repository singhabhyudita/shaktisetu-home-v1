import "@testing-library/jest-dom";

window.scrollTo = jest.fn();

// Mock Supabase
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      upload: jest
        .fn()
        .mockResolvedValue({ data: { path: "test-path" }, error: null }),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: "http://test.com/test.png" },
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest
          .fn()
          .mockResolvedValue({ data: { path: "test-path" }, error: null }),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "http://test.com/test.png" },
        })),
      })),
    },
    functions: {
      invoke: jest
        .fn()
        .mockResolvedValue({ data: { success: true }, error: null }),
    },
    auth: {
      getSession: jest
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  })),
}));
