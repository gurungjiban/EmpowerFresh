import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres', 
  password: '1111',
  host: 'localhost',
  database: 'EmpowerFresh',
  port: 5433
});

// Customers Endpoints
app.get('/customers', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers ORDER BY id');
  res.json(result.rows);
});

app.post('/customers', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM customers WHERE id=$1', [id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Stores Endpoints
app.get('/stores', async (req, res) => {
  const result = await pool.query('SELECT * FROM stores ORDER BY id');
  res.json(result.rows);
});

app.post('/stores', async (req, res) => {
  const { name, location, customer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO stores (name, location, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [name, location, customer_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add store' });
  }
});

app.delete('/stores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM stores WHERE id=$1', [id]);
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

// Products Endpoints
app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY id');
  res.json(result.rows);
});

app.post('/products', async (req, res) => {
  const { name, price, store_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, store_id) VALUES ($1, $2, $3) RETURNING *',
      [name, price, store_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

