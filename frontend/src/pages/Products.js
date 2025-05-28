import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const productData = product.attributes || product;
        const imageUrl = productData.productimages?.[0]?.file?.[0]?.url
          ? `/uploads/${productData.productimages[0].file[0].url}`
          : null;

        return (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  backgroundColor: "grey.100",
                }}
              >
                {imageUrl ? (
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={productData.title}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "grey.100",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: "grey.400" }} />
                  </Box>
                )}
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {productData.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {productData.description?.[0]?.children?.[0]?.text ||
                    "No description available"}
                </Typography>

                {productData.product_category?.data && (
                  <Chip
                    label={productData.product_category.data.attributes.title}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}

                {productData.product_version?.data && (
                  <Chip
                    label={productData.product_version.data.attributes.title}
                    color="secondary"
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Products;
