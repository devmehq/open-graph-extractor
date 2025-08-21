import { extractOpenGraph } from "../src";

describe("favicon extraction", () => {
  it("should extract favicon from shortcut icon", () => {
    const html = `
      <html>
        <head>
          <link rel="shortcut icon" href="/favicon.ico">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("/favicon.ico");
  });

  it("should extract favicon from icon link", () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="/favicon.png">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("/favicon.png");
  });

  it("should extract favicon from apple-touch-icon", () => {
    const html = `
      <html>
        <head>
          <link rel="apple-touch-icon" href="/apple-icon.png">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("/apple-icon.png");
  });

  it("should extract favicon with query params", () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="/favicon.ico?v=123">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("/favicon.ico?v=123");
  });

  it("should prioritize shortcut icon over regular icon", () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="/regular.ico">
          <link rel="shortcut icon" href="/shortcut.ico">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("/shortcut.ico");
  });

  it("should handle absolute URLs", () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="https://example.com/favicon.ico">
        </head>
      </html>
    `;
    const result = extractOpenGraph(html);
    expect(result.favicon).toEqual("https://example.com/favicon.ico");
  });
});
