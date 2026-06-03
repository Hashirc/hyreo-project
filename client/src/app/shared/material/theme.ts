import { HarnessLoader } from '@angular/cdk/testing';
import { TestBed } from '@angular/core/testing';

// Olive Green Theme Configuration
export const THEME_COLORS = {
  primary: '#556B2F',      // Olive Green
  secondary: '#FFFFFF',    // White
  accent: '#6B8E23',       // Light Olive
  lightAccent: '#9ACD32',  // Yellow Green
  darkPrimary: '#3d4d1f',  // Dark Olive
  lightGrey: '#f5f5f5',
  darkGrey: '#333333',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3'
};

export const MATERIAL_THEME = `
  @import '@angular/material/prebuilt-themes/indigo-pink.css';

  @import '@angular/material/theming';

  @include mat-core();

  $custom-palette: (
    50: #f1f3ed,
    100: #d9dfd1,
    200: #bfc9b4,
    300: #a4b396,
    400: #8fa380,
    500: #7a926a,
    600: #6b8a5f,
    700: #5b8052,
    800: #4b7646,
    900: #384330,
    A100: #a4ff6e,
    A200: #81ff3b,
    A400: #5eff08,
    A700: #44e500,
    contrast: (
      50: $dark-primary-text,
      100: $dark-primary-text,
      200: $dark-primary-text,
      300: $dark-primary-text,
      400: $dark-primary-text,
      500: $light-primary-text,
      600: $light-primary-text,
      700: $light-primary-text,
      800: $light-primary-text,
      900: $light-primary-text,
      A100: $dark-primary-text,
      A200: $light-primary-text,
      A400: $light-primary-text,
      A700: $light-primary-text,
    )
  );

  $my-app-primary: mat-palette($custom-palette);
  $my-app-accent: mat-palette($mat-pink, A200, A100, A400);
  $my-app-warn: mat-palette($mat-deep-orange);

  $my-app-theme: mat-light-theme($my-app-primary, $my-app-accent, $my-app-warn);

  @include angular-material-theme($my-app-theme);

  .dark-theme {
    $dark-primary: mat-palette($mat-blue-grey);
    $dark-accent: mat-palette($mat-amber, A200, A100, A400);
    $dark-warn: mat-palette($mat-deep-orange);

    $dark-theme: mat-dark-theme($dark-primary, $dark-accent, $dark-warn);

    @include angular-material-theme($dark-theme);
  }
`;

export const CUSTOM_THEME_VARIABLES = `
  :root {
    --primary-color: ${THEME_COLORS.primary};
    --secondary-color: ${THEME_COLORS.secondary};
    --accent-color: ${THEME_COLORS.accent};
    --light-accent-color: ${THEME_COLORS.lightAccent};
    --dark-primary-color: ${THEME_COLORS.darkPrimary};
    --light-grey-color: ${THEME_COLORS.lightGrey};
    --dark-grey-color: ${THEME_COLORS.darkGrey};
    --success-color: ${THEME_COLORS.success};
    --error-color: ${THEME_COLORS.error};
    --warning-color: ${THEME_COLORS.warning};
    --info-color: ${THEME_COLORS.info};
  }

  body {
    background-color: var(--secondary-color);
    color: var(--dark-grey-color);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  button {
    background-color: var(--primary-color);
    color: var(--secondary-color);
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: var(--dark-primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3);
  }

  button:active {
    transform: translateY(0);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--accent-color);
  }

  .input-field {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px 12px;
    transition: all 0.3s ease;
  }

  .input-field:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(85, 107, 47, 0.1);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .card {
    background: var(--secondary-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: all 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 4px 16px rgba(85, 107, 47, 0.15);
    transform: translateY(-4px);
  }

  .section-title {
    color: var(--primary-color);
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 20px;
  }
`;
