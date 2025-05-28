import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log("API Response:", data);
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderDescription = (description) => {
    if (!description) return null;
    if (typeof description === "string") return description;
    if (Array.isArray(description)) {
      return description
        .map((item) => {
          if (item.children) {
            return item.children
              .map((child) => child.text)
              .join(" ")
              .trim();
          }
          return "";
        })
        .join("\n")
        .trim();
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
          onClick={() => window.location.reload()}
          startIcon={<CategoryIcon />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Fade in timeout={500}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Product Categories
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Explore our wide range of microelectronic product categories
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {categories.map((category) => {
              const categoryData = category.attributes || category;
              const imageUrl = categoryData.images?.[0]?.file?.[0]?.url
                ? `http://localhost:5000${categoryData.images?.[0]?.file?.[0]?.url}`
                : null;
              return (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Zoom in timeout={500}>
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
                            alt={categoryData.title}
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
                            <CategoryIcon
                              sx={{
                                fontSize: 64,
                                color: "grey.400",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          fontWeight="bold"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CategoryIcon color="primary" />
                          {categoryData.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {renderDescription(categoryData.description)}
                        </Typography>

                        <Box sx={{ mt: "auto" }}>
                          <Button
                            variant="contained"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            onClick={() =>
                              navigate(`/categories/${category.id}/products`)
                            }
                            sx={{
                              mt: 2,
                              py: 1,
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #1976D2 30%, #0097A7 90%)",
                              },
                            }}
                          >
                            View Products
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
}

export default Categories;
