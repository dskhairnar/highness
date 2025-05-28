import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import ProductVersions from "./pages/ProductVersions";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Routes>
              <Route path="/" element={<Categories />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/categories/:categoryId/products"
                element={<CategoryProducts />}
              />
              <Route
                path="/products/:productId/versions"
                element={<ProductVersions />}
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
