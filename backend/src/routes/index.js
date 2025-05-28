const express = require("express");
const router = express.Router();
const strapiService = require("../services/strapi");
const config = require("../config");
const axios = require("axios");
const path = require("path");

// Root route
router.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// Categories
router.get("/categories", async (req, res) => {
  try {
    console.log("GET /categories - Fetching categories");
    const data = await strapiService.getCategories();
    console.log("GET /categories - Success:", data);
    res.json(data);
  } catch (error) {
    console.error("GET /categories - Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch categories",
      details: error.response?.data?.error || error.message,
    });
  }
});

router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`GET /categories/${id} - Fetching category`);
    const data = await strapiService.getCategory(id);
    console.log(`GET /categories/${id} - Success:`, data);
    res.json(data);
  } catch (error) {
    console.error(`GET /categories/${id} - Error:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch category",
      details: error.response?.data?.error || error.message,
    });
  }
});

// Products
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const params = category
      ? { filters: { product_category: { id: { $eq: category } } } }
      : {};
    const data = await strapiService.getProducts(params);
    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await strapiService.getProduct(id);
    if (!data || !data.data) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    // Check if it's a 404 error from Strapi
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Versions
router.get("/versions", async (req, res) => {
  try {
    const { product } = req.query;
    if (!product) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // First verify the product exists
    try {
      const productData = await strapiService.getProduct(product);
      if (!productData || !productData.data) {
        return res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: "Product not found" });
      }
      throw error;
    }

    const params = {
      filters: {
        product: {
          id: parseInt(product),
        },
      },
      populate: {
        productImages: {
          populate: {
            file: {
              populate: "*",
            },
          },
        },
        specs: true,
      },
    };

    const data = await strapiService.getVersions(params);
    res.json(data);
  } catch (error) {
    console.error("Error fetching versions:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

router.get("/versions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await strapiService.getVersion(id);
    if (!data || !data.data) {
      return res.status(404).json({ error: "Version not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching version:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Version not found" });
    }
    res.status(500).json({ error: "Failed to fetch version" });
  }
});

// Images
router.get("/images", async (req, res) => {
  try {
    const data = await strapiService.getImages();
    res.json(data);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Product Images
router.get("/uploads/*", async (req, res) => {
  try {
    const imagePath = req.path;
    const imageUrl = `${config.strapi.url}${imagePath}`;

    // Fetch the image from Strapi
    const imageResponse = await axios.get(imageUrl, {
      responseType: "stream",
    });

    // Set appropriate headers
    res.setHeader("Content-Type", imageResponse.headers["content-type"]);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Pipe the image stream to the response
    imageResponse.data.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

module.exports = router;
