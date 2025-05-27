const axios = require("axios");
const qs = require("qs");
const config = require("../config");

const strapi = axios.create({
  baseURL: config.strapi.url,
  headers: {
    "Content-Type": "application/json",
    ...(config.strapi.token && {
      Authorization: `Bearer ${config.strapi.token}`,
    }),
  },
});

// Helper function to build query parameters
const buildQuery = (params = {}) => {
  const query = {
    populate: params.populate || [],
    filters: params.filters || {},
    sort: params.sort || [],
    pagination: params.pagination || {},
    fields: params.fields || [],
  };

  return qs.stringify(query, { encodeValuesOnly: true });
};

// Helper function to handle API errors
const handleApiError = (error, resource) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`Strapi API Error (${resource}):`, {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url,
    });

    if (error.response.status === 404) {
      throw new Error(`${resource} not found`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error(`Strapi API Error (${resource}): No response received`);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(`Strapi API Error (${resource}):`, error.message);
  }
  throw error;
};

// Helper function to transform Strapi response
const transformResponse = (data) => {
  if (!data) return null;

  // If it's a single item
  if (data.data && !Array.isArray(data.data)) {
    return {
      data: {
        id: data.data.id,
        documentId: data.data.documentId,
        ...data.data.attributes,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        publishedAt: data.data.publishedAt,
      },
      meta: data.meta,
    };
  }

  // If it's a list of items
  if (data.data && Array.isArray(data.data)) {
    return {
      data: data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        ...item.attributes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
      })),
      meta: data.meta,
    };
  }

  return data;
};

module.exports = {
  // Products
  getProducts: async (params = {}) => {
    try {
      const query = buildQuery({
        populate: ["product_category", "product_version", "productimages"],
        ...params,
      });
      const response = await strapi.get(`/products?${query}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Products");
    }
  },

  getProduct: async (id, params = {}) => {
    try {
      // Try to find by documentId first
      let query = buildQuery({
        populate: ["product_category", "product_version", "productimages"],
        filters: { documentId: id },
        ...params,
      });
      let response = await strapi.get(`/products?${query}`);

      // If not found by documentId, try by numeric ID
      if (!response.data.data.length) {
        query = buildQuery({
          populate: ["product_category", "product_version", "productimages"],
          filters: { id: parseInt(id) },
          ...params,
        });
        response = await strapi.get(`/products?${query}`);
      }

      // If still not found, try by slug
      if (!response.data.data.length) {
        query = buildQuery({
          populate: ["product_category", "product_version", "productimages"],
          filters: { slug: id },
          ...params,
        });
        response = await strapi.get(`/products?${query}`);
      }

      if (!response.data.data.length) {
        throw new Error(`Product not found with identifier: ${id}`);
      }

      // Return the first matching product
      return {
        data: response.data.data[0],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error, `Product ${id}`);
    }
  },

  createProduct: async (data) => {
    try {
      const response = await strapi.post("/products", { data });
      return response.data;
    } catch (error) {
      handleApiError(error, "Create Product");
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await strapi.put(`/products/${id}`, { data });
      return response.data;
    } catch (error) {
      handleApiError(error, `Update Product ${id}`);
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await strapi.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Delete Product ${id}`);
    }
  },

  // Categories
  getCategories: async (params = {}) => {
    try {
      console.log("Fetching categories with params:", params);
      const query = qs.stringify(
        {
          populate: {
            images: {
              populate: {
                file: {
                  populate: "*",
                },
              },
            },
          },
          ...params,
        },
        {
          encodeValuesOnly: true,
        }
      );
      console.log("Built query:", query);
      const response = await strapi.get(`/product-categories?${query}`);
      console.log("Categories response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Strapi API Error (Categories):", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      handleApiError(error, "Categories");
    }
  },

  getCategory: async (id, params = {}) => {
    try {
      // First try to find by numeric ID
      let query = buildQuery({
        populate: {
          images: {
            populate: {
              file: {
                populate: "*",
              },
            },
          },
        },
        filters: { id: id },
        ...params,
      });
      let response = await strapi.get(`/product-categories?${query}`);

      // If not found by numeric ID, try by slug
      if (!response.data.data.length) {
        query = buildQuery({
          populate: {
            images: {
              populate: {
                file: {
                  populate: "*",
                },
              },
            },
          },
          filters: { slug: id },
          ...params,
        });
        response = await strapi.get(`/product-categories?${query}`);
      }

      // If still not found, try by documentId as fallback
      if (!response.data.data.length) {
        query = buildQuery({
          populate: {
            images: {
              populate: {
                file: {
                  populate: "*",
                },
              },
            },
          },
          filters: { documentId: id },
          ...params,
        });
        response = await strapi.get(`/product-categories?${query}`);
      }

      if (!response.data.data.length) {
        throw new Error(`Category not found with identifier: ${id}`);
      }

      // Return the first matching category
      return {
        data: response.data.data[0],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error, `Category ${id}`);
    }
  },

  createCategory: async (data) => {
    try {
      // Generate slug from title if not provided
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const response = await strapi.post("/product-categories", { data });
      return response.data;
    } catch (error) {
      handleApiError(error, "Create Category");
    }
  },

  updateCategory: async (id, data) => {
    try {
      // Generate slug from title if title is being updated and slug is not provided
      if (data.title && !data.slug) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const response = await strapi.put(`/product-categories/${id}`, { data });
      return response.data;
    } catch (error) {
      handleApiError(error, `Update Category ${id}`);
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await strapi.delete(`/product-categories/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Delete Category ${id}`);
    }
  },

  // Versions
  getVersions: async (params = {}) => {
    try {
      const query = buildQuery({
        populate: ["product", "productImages", "specs"],
        ...params,
      });
      const response = await strapi.get(`/product-versions?${query}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Versions");
    }
  },

  getVersion: async (id, params = {}) => {
    try {
      // Try to find by documentId first
      let query = buildQuery({
        populate: ["product", "productImages", "specs"],
        filters: { documentId: id },
        ...params,
      });
      let response = await strapi.get(`/product-versions?${query}`);

      // If not found by documentId, try by numeric ID
      if (!response.data.data.length) {
        query = buildQuery({
          populate: ["product", "productImages", "specs"],
          filters: { id: parseInt(id) },
          ...params,
        });
        response = await strapi.get(`/product-versions?${query}`);
      }

      // If still not found, try by slug
      if (!response.data.data.length) {
        query = buildQuery({
          populate: ["product", "productImages", "specs"],
          filters: { slug: id },
          ...params,
        });
        response = await strapi.get(`/product-versions?${query}`);
      }

      if (!response.data.data.length) {
        throw new Error(`Version not found with identifier: ${id}`);
      }

      // Return the first matching version
      return {
        data: response.data.data[0],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error, `Version ${id}`);
    }
  },

  createVersion: async (data) => {
    try {
      const response = await strapi.post("/product-versions", { data });
      return response.data;
    } catch (error) {
      handleApiError(error, "Create Version");
    }
  },

  updateVersion: async (id, data) => {
    try {
      const response = await strapi.put(`/product-versions/${id}`, { data });
      return response.data;
    } catch (error) {
      handleApiError(error, `Update Version ${id}`);
    }
  },

  deleteVersion: async (id) => {
    try {
      const response = await strapi.delete(`/product-versions/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Delete Version ${id}`);
    }
  },

  // Images
  getImages: async (params = {}) => {
    try {
      const query = buildQuery(params);
      const response = await strapi.get(`/images?${query}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Images");
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      const response = await strapi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Upload Image");
    }
  },
};
