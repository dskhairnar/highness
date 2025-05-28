import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Breadcrumbs,
  Link,
  Alert,
  Button,
  Paper,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Container,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ImageIcon from "@mui/icons-material/Image";

function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoryResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/categories/${categoryId}`),
          axios.get(`http://localhost:5000/products?category=${categoryId}`),
        ]);

        setCategory(categoryResponse.data.data);
        setProducts(productsResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 404) {
          setError(
            "Category not found. It may have been removed or is no longer available."
          );
        } else {
          setError(
            err.response?.data?.error ||
              "An error occurred while fetching the data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const renderDescription = (description) => {
    if (!description) return null;

    // If description is a string, return it directly
    if (typeof description === "string") {
      return description;
    }

    // If description is an array of objects with type and children
    if (Array.isArray(description)) {
      return description
        .map((item, index) => {
          if (item.type === "paragraph" && item.children) {
            return item.children
              .map((child, childIndex) => child.text)
              .join(" ");
          }
          return null;
        })
        .filter(Boolean)
        .join("\n");
    }

    return null;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/categories"
          startIcon={<CategoryIcon />}
        >
          View Categories
        </Button>
      </Box>
    );
  }

  if (!category) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Category not found
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/categories"
          startIcon={<CategoryIcon />}
        >
          View Categories
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)',
            borderRadius: 2,
          }}
        >
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link component={RouterLink} to="/categories" color="inherit">
              Categories
            </Link>
            <Typography color="text.primary">{category.title}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {category.title}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Back to Categories
            </Button>
          </Box>

          {category.description && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {renderDescription(category.description)}
              </Typography>
            </Paper>
          )}
        </Paper>
      </Fade>

      {products.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#2196F3',
            },
          }}
        >
          No products found in this category
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Zoom in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card 
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    {product.productimages?.[0]?.url ? (
                      <CardMedia
                        component="img"
                        image={`http://localhost:1337${product.productimages[0].url}`}
                        alt={product.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f5f5f5',
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 48, color: '#bdbdbd' }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="div"
                      sx={{ 
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {product.status && (
                        <Chip
                          label={product.status}
                          color={product.status === 'published' ? 'success' : 'default'}
                          size="small"
                          sx={{ 
                            borderRadius: 1,
                            fontWeight: 500,
                          }}
                        />
                      )}
                      {product.featured && (
                        <Chip
                          label="Featured"
                          color="primary"
                          size="small"
                          icon={<LocalOfferIcon />}
                          sx={{ 
                            borderRadius: 1,
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Stack>

                    {product.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {renderDescription(product.description)}
                      </Typography>
                    )}

                    {product.specifications && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography 
                          variant="subtitle2" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          Key Specifications
                        </Typography>
                        <List dense>
                          {product.specifications.slice(0, 3).map((spec, index) => (
                            <ListItem 
                              key={index} 
                              sx={{ 
                                py: 0.5,
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography 
                                      variant="body2" 
                                      component="span"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {spec.title}
                                    </Typography>
                                    {spec.description && (
                                      <Tooltip title={spec.description}>
                                        <IconButton 
                                          size="small" 
                                          sx={{ 
                                            ml: 0.5,
                                            color: 'primary.main',
                                          }}
                                        >
                                          <InfoIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {spec.value}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}

                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        component={RouterLink}
                        to={`/products/${product.id}/versions`}
                        startIcon={<DescriptionIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          py: 1,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                          },
                        }}
                      >
                        View Versions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default CategoryProducts;
