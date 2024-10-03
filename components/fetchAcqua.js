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


export default async function registerTransactionPersonalServer({ transactionObject } = {}) {

  // Save to Maidapi

  // https://crvmb5tnnr.us-east-1.awsapprunner.com/mely/transactions
  // class POSTransactions(Base):
  //     """
  //     Point of Sale Transactions
  //     """
  //     __tablename__ = 'pos_transactions'
  //     id = Column(Integer, primary_key=True, autoincrement=True, index=True)
  //     date = Column(DateTime, nullable=False, server_default=func.now())
  //     order_number = Column(String(255), nullable=False)
  //     local = Column(String(255), nullable=False)
  //     total = Column(Float, nullable=False)
  //     status = Column(String(255), nullable=False) # In Server | Manual Submission.
  //     is_active = Column(Boolean, nullable=False, default=True)
  //     itemsJSON = Column(JSON, nullable=False)



  try {
    const config = {
      method: 'post',
      url: 'https://crvmb5tnnr.us-east-1.awsapprunner.com/mely/transactions',
      headers: {
        'Content-Type': 'application/json'
      },
      data: transactionObject
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;

  }
  catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    return { message: 'Error fetching products' };
  }
}

export default async function getTransactionsPersonalServer(){
  try {
    const config = {
      method: 'get',
      url: 'https://crvmb5tnnr.us-east-1.awsapprunner.com/mely/transactions',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;

  }
  catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    return { message: 'Error fetching products' };
  }
}