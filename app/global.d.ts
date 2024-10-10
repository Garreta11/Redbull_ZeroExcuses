// global.d.ts
declare global {
  interface Window {
      ml5: {
          neuralNetwork: (options: any) => any; // Specify a more precise type if possible
      };
  }
}

// This line is needed to make this file a module.
export {};