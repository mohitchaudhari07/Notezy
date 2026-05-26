# Project Folder Structure

Based on your design mockups, here's the recommended folder structure:

```
frontend/
├── pages/
│   ├── home/
│   ├── auth/
│   ├── student-dashboard/
│   ├── branch-overview/
│   ├── subject-listing/
│   ├── search-results/
│   ├── document-viewer/
│   └── about-contact/
│
└── components/
    ├── shared/              # Header, Footer, Navigation, etc.
    ├── layout/              # Page layouts, containers
    ├── auth/                # Login, Register, Password reset components
    ├── student-dashboard/   # Dashboard-specific components
    ├── branch/              # Branch overview components
    ├── subject/             # Subject listing components
    ├── search/              # Search results components
    ├── document/            # Document viewer components
    └── about-contact/       # About & Contact page components
```

## Creating the Structure

### Option 1: Using Git Bash or Terminal

```bash
mkdir -p frontend/{pages,components}/{home,auth,student-dashboard,branch-overview,subject-listing,search-results,document-viewer,about-contact}
mkdir -p frontend/components/{shared,layout,branch,subject,search,document}
```

### Option 2: Using Windows Command Prompt

```cmd
cd frontend
mkdir pages\home pages\auth pages\student-dashboard pages\branch-overview pages\subject-listing pages\search-results pages\document-viewer pages\about-contact
mkdir components\shared components\layout components\auth components\student-dashboard components\branch components\subject components\search components\document components\about-contact
```

### Option 3: Using PowerShell (Windows 7+)

```powershell
$dirs = @(
  'pages/home', 'pages/auth', 'pages/student-dashboard', 'pages/branch-overview',
  'pages/subject-listing', 'pages/search-results', 'pages/document-viewer', 'pages/about-contact',
  'components/shared', 'components/layout', 'components/auth', 'components/student-dashboard',
  'components/branch', 'components/subject', 'components/search', 'components/document', 'components/about-contact'
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Path "frontend/$dir" -Force | Out-Null
}
```

## Folder Descriptions

| Folder                         | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `pages/home`                   | Home page components and layout                      |
| `pages/auth`                   | Authentication screens (login, register)             |
| `pages/student-dashboard`      | Student dashboard page                               |
| `pages/branch-overview`        | Branch overview page                                 |
| `pages/subject-listing`        | Subject listing page                                 |
| `pages/search-results`         | Search results page                                  |
| `pages/document-viewer`        | Document viewer page                                 |
| `pages/about-contact`          | About & Contact page                                 |
| `components/shared`            | Reusable components (Header, Footer, Navbar, etc.)   |
| `components/layout`            | Page layout wrappers                                 |
| `components/auth`              | Auth-specific components (login form, register form) |
| `components/student-dashboard` | Dashboard-specific UI components                     |
| `components/branch`            | Branch-related components                            |
| `components/subject`           | Subject-related components                           |
| `components/search`            | Search UI components                                 |
| `components/document`          | Document viewer UI components                        |
| `components/about-contact`     | About & Contact form components                      |
