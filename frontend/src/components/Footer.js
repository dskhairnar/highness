import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Highness Micro
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Providing high-quality microelectronic solutions for your business
              needs.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                color="primary"
                aria-label="Facebook"
                component="a"
                href="#"
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Twitter"
                component="a"
                href="#"
                target="_blank"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="LinkedIn"
                component="a"
                href="#"
                target="_blank"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="GitHub"
                component="a"
                href="#"
                target="_blank"
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/categories"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Categories
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Contact
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Support
            </Typography>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Help Center
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Documentation
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              API Reference
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Status
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Legal
            </Typography>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Cookie Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              display="block"
              sx={{ mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              License
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Highness Micro. All rights reserved.
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ by Highness Team
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 