import "@testing-library/jest-dom";

// Mock GSAP for tests
jest.mock("gsap", () => ({
  gsap: {
    fromTo: jest.fn(),
    to: jest.fn(),
    timeline: jest.fn(() => ({
      from: jest.fn(),
      to: jest.fn(),
    })),
    quickTo: jest.fn(() => jest.fn()),
    registerPlugin: jest.fn(),
  },
  Draggable: {
    create: jest.fn(() => [
      { kill: jest.fn(), enable: jest.fn(), disable: jest.fn() },
    ]),
  },
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
