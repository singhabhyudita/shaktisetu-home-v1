import {
  SITE_INFO,
  HERO_CONTENT,
  MISSION_CONTENT,
  FEATURES_CONTENT,
} from "../siteContent";

describe("siteContent", () => {
  it("should have all required sections", () => {
    expect(SITE_INFO).toBeDefined();
    expect(HERO_CONTENT).toBeDefined();
    expect(MISSION_CONTENT).toBeDefined();
    expect(FEATURES_CONTENT).toBeDefined();
  });

  it("should have valid hero content", () => {
    expect(HERO_CONTENT.title).toBeDefined();
    expect(HERO_CONTENT.subtitle).toBeDefined();
  });

  it("should have valid mission content", () => {
    expect(MISSION_CONTENT.title).toBeDefined();
    expect(MISSION_CONTENT.text).toBeDefined();
  });
});
