// ESP32 BMI Data Cloud API
// File: api/bmi-data.js

export default async function handler(req, res) {
  // Enable CORS for ESP32
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      service: 'ESP32 BMI Cloud System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      message: 'API is ready to receive BMI data from ESP32',
      endpoints: {
        post_data: 'POST /api/bmi-data',
        test: 'GET /api/bmi-data'
      }
    });
  }
  
  // POST request - receive data from ESP32
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const timestamp = new Date().toISOString();
      
      // Log received data
      console.log('========================================');
      console.log('✅ ESP32 BMI DATA RECEIVED ✅');
      console.log('========================================');
      console.log('Time:', timestamp);
      console.log('Customer ID:', data.customerId || 'Not provided');
      console.log('Name:', data.name || 'Not provided');
      console.log('Age:', data.age || 'Not provided');
      console.log('Gender:', data.gender || 'Not provided');
      console.log('Height:', data.heightCM || 0, 'cm');
      console.log('Weight:', data.weight || 0, 'kg');
      console.log('BMI:', data.bmi || 0);
      console.log('Category:', data.category || 'Not calculated');
      console.log('Calorie Target:', data.calorieTarget || 0);
      console.log('========================================');
      
      // Validate required fields
      if (!data.customerId) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing customerId',
          required: ['customerId', 'bmi']
        });
      }
      
      if (!data.bmi) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing bmi',
          required: ['customerId', 'bmi']
        });
      }
      
      // Success response
      return res.status(200).json({
        status: 'success',
        message: 'BMI data received successfully',
        timestamp: timestamp,
        customerId: data.customerId,
        data_received: {
          bmi: data.bmi,
          category: data.category || 'Unknown',
          height_cm: data.heightCM || 0,
          weight_kg: data.weight || 0
        },
        note: 'Data logged to Vercel console'
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    status: 'error',
    message: 'Method not allowed'
  });
}
