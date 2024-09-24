import axios from 'axios';

export default async function handleUvicorn(req, res) {
  // Run the CORS middleware before processing the request
  // await runMiddleware(req, res, cors);

  try {
    const config = {
      method: 'GET',
      url: 'http://127.0.0.1:8000/mely/products_acqua',

    };

    const response = await axios(config);
    console.log('response', response.data);
    // Send the data back to the client-side
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
}
