import axios from 'axios';
import cors, { runMiddleware } from '../utils/cors';

export default async function handler(req, res) {
  // Run the CORS middleware before processing the request
  // await runMiddleware(req, res, cors);

  try {
    const config = {
      method: 'get',
      url: 'http://cloud.acqua-erp.com:80/Coruscis/jwt?type=query&id_query=getAllProducts&id_client=api',
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0cyI6ICIxNzI3MDk0MDQyMzE2In0.YQs3EVya3LL3hXcMKB8OWB7ZWIgEB8lbf-7WdwOH5wQ',
        
      }
    };

    const response = await axios(config);

    // Send the data back to the client-side
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
}
