const axios = require("axios");
const qs = require("qs");
const config = require("../config");

// Axios instance for Strapi
const strapi = axios.create({
  baseURL: config.strapi.url,
  headers: {
    "Content-Type": "application/json",
    ...(config.strapi.token && {
      Authorization: `Bearer ${config.strapi.token}`,
    }),
  },
});

// Helper: Build query string from params
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

// Helper: API error handler
const handleApiError = (error, resource) => {
  if (error.response) {
    console.error(`Strapi API Error (${resource}):`, {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url,
    });
    if (error.response.status === 404) {
      throw new Error(`${resource} not found`);
    }
  } else if (error.request) {
    console.error(`Strapi API Error (${resource}): No response received`);
  } else {
    console.error(`Strapi API Error (${resource}):`, error.message);
  }
  throw error;
};

module.exports = {
  // ================== PRODUCTS ==================
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
      const identifiers = [
        { documentId: id },
        { id: parseInt(id) },
        { slug: id },
      ];

      for (const filter of identifiers) {
        const query = buildQuery({
          populate: ["product_category", "product_version", "productimages"],
          filters: filter,
          ...params,
        });
        const response = await strapi.get(`/products?${query}`);
        if (response.data.data?.length) {
          return {
            data: response.data.data[0],
            meta: response.data.meta,
          };
        }
      }

      throw new Error(`Product not found with identifier: ${id}`);
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

  // ================== CATEGORIES ==================
  getCategories: async (params = {}) => {
    try {
      const query = qs.stringify(
        {
          populate: {
            images: {
              populate: {
                file: { populate: "*" },
              },
            },
          },
          ...params,
        },
        { encodeValuesOnly: true }
      );
      const response = await strapi.get(`/product-categories?${query}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Categories");
    }
  },

  getCategory: async (id, params = {}) => {
    try {
      const identifiers = [{ id: id }, { slug: id }, { documentId: id }];

      for (const filter of identifiers) {
        const query = buildQuery({
          populate: {
            images: {
              populate: {
                file: { populate: "*" },
              },
            },
          },
          filters: filter,
          ...params,
        });
        const response = await strapi.get(`/product-categories?${query}`);
        if (response.data.data?.length) {
          return {
            data: response.data.data[0],
            meta: response.data.meta,
          };
        }
      }

      throw new Error(`Category not found with identifier: ${id}`);
    } catch (error) {
      handleApiError(error, `Category ${id}`);
    }
  },

  createCategory: async (data) => {
    try {
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

  // ================== VERSIONS ==================
  getVersions: async (params = {}) => {
    try {
      const query = qs.stringify(
        {
          populate: {
            product: true,
            productImages: {
              populate: {
                file: { populate: "*" },
              },
            },
            specs: true,
          },
          ...params,
        },
        { encodeValuesOnly: true }
      );
      const response = await strapi.get(`/product-versions?${query}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Versions");
    }
  },

  getVersion: async (id, params = {}) => {
    try {
      const identifiers = [
        { documentId: id },
        { id: parseInt(id) },
        { slug: id },
      ];

      for (const filter of identifiers) {
        const query = buildQuery({
          populate: {
            product: true,
            productImages: {
              populate: {
                file: { populate: "*" },
              },
            },
            specs: true,
          },
          filters: filter,
          ...params,
        });
        const response = await strapi.get(`/product-versions?${query}`);
        if (response.data.data?.length) {
          return {
            data: response.data.data[0],
            meta: response.data.meta,
          };
        }
      }

      throw new Error(`Version not found with identifier: ${id}`);
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

  // ================== PRODUCT IMAGES ==================
  getProductImage: async (documentId) => {
    try {
      const query = qs.stringify(
        {
          filters: {
            documentId: documentId,
          },
          populate: {
            file: {
              populate: "*",
            },
          },
        },
        { encodeValuesOnly: true }
      );
      const response = await strapi.get(`/product-images?${query}`);
      if (!response.data.data?.length) {
        throw new Error(
          `Product image not found with documentId: ${documentId}`
        );
      }
      return {
        data: response.data.data[0],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error, `Product Image ${documentId}`);
    }
  },
};
