const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');

const app = express();
app.use(cors());

const STRAPI_URL = 'http://localhost:1337/api';

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// ✅ Fetch all products with populated modules
app.get('/products', async (req, res) => {
  try {
    const query = qs.stringify({
      populate: ['modules']  // ✅ Use the correct field name
    }, { encodeValuesOnly: true });

    const response = await axios.get(`${STRAPI_URL}/products?${query}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Fetch a single product by slug with populated modules
app.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const query = qs.stringify({
      filters: {
        slug: { $eq: slug }
      },
      populate: ['modules']  // ✅ Use the correct field name
    }, { encodeValuesOnly: true });

    const response = await axios.get(`${STRAPI_URL}/products?${query}`);
    const product = response.data.data[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
// Fetch all modules
app.get('/modules', async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/modules`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching modules:', error.message);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});


// ✅ Fetch all products under a specific module title
app.get('/modules/:title/products', async (req, res) => {
  try {
    const { title } = req.params;
    const query = qs.stringify({
      filters: {
        modules: {
          title: { $eq: title }
        }
      },
      populate: ['modules']
    }, { encodeValuesOnly: true });

    const response = await axios.get(`${STRAPI_URL}/products?${query}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching module products:', error.message);
    res.status(500).json({ error: 'Failed to fetch module products' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
