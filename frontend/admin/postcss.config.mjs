/**
 * PostCSS Configuration: Defines the plugins used for processing CSS.
 * This setup integrates Tailwind CSS and Autoprefixer into the build pipeline.
 */
const config = {
  plugins: {
    // Process Tailwind CSS directives and utilities
    tailwindcss: {},
    // Automatically add vendor prefixes to CSS rules (e.g., -webkit-, -moz-)
    autoprefixer: {},
  },
};

export default config;
