export default {
    Map: jest.fn(() => ({
      on: jest.fn(),
      remove: jest.fn(),
      addControl: jest.fn(),
      flyTo: jest.fn(),
      resize: jest.fn(),
    })),
  };
  