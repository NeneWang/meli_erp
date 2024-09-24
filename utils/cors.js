import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],  // You can add other HTTP methods if needed
  origin: '*',               // Allow all origins for development, change this for production
});

// Helper function to run middleware (this is a wrapper for Next.js)
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
