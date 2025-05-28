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
  List,
  ListItem,
  ListItemText,
  Container,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

function Versions() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        // First fetch the product details
        const productResponse = await axios.get(
          `http://localhost:5000/products/${productId}`
        );
        setProduct(productResponse.data.data);

        // Then fetch versions for this product
        const versionsResponse = await axios.get(
          `http://localhost:5000/versions?product=${productId}`
        );
        setVersions(versionsResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (productId) {
      fetchVersions();
    }
  }, [productId]);

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
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {product && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.attributes?.title || product.title} - Versions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {product.attributes?.description?.[0]?.children?.[0]?.text ||
              product.description?.[0]?.children?.[0]?.text ||
              "No description available"}
          </Typography>
        </Box>
      )}

      {versions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No versions found for this product
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {versions.map((version) => {
            const versionData = version.attributes || version;
            console.log(versionData);
            console.log("Version data:", versionData);
            const imageUrl = versionData.productImages?.[0]?.file?.data?.[0]
              ?.attributes?.url
              ? `/uploads/${versionData.productImages[0].file.data[0].attributes.url}`
              : versionData.productImages?.[0]?.file?.url
              ? `/uploads/${versionData.productImages[0].file.url}`
              : null;

            console.log("Image URL:", imageUrl);

            return (
              <Grid item xs={12} sm={6} md={4} key={version.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
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
                        alt={versionData.name}
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {versionData.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {versionData.description?.[0]?.children?.[0]?.text ||
                        "No description available"}
                    </Typography>

                    {versionData.product?.data && (
                      <Chip
                        label={versionData.product.data.attributes.title}
                        color="primary"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}

                    {versionData.specs?.data &&
                      versionData.specs.data.length > 0 && (
                        <List dense>
                          {versionData.specs.data.map((spec, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={spec.attributes.title}
                                secondary={spec.attributes.value}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Versions;
