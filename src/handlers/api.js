const { getConnection } = require('../config/database');

async function handler(event, context) {
  try {
    // Enable connection reuse
    context.callbackWaitsForEmptyEventLoop = false;

    const pool = await getConnection();
    
    const path = event.path;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    let response;

    switch (`${method} ${path}`) {
      case 'GET /items':
        const result = await pool.request()
          .query('SELECT * FROM Items');
        response = result.recordset;
        break;

      case 'POST /items':
        await pool.request()
          .input('name', sql.NVarChar, body.name)
          .input('description', sql.NVarChar, body.description)
          .query('INSERT INTO Items (name, description) VALUES (@name, @description)');
        response = { message: 'Item created successfully' };
        break;

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not Found' })
        };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
}