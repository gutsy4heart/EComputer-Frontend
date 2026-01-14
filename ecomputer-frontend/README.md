# EComputer Frontend

This is the frontend application for the EComputer project, built with Next.js and Tailwind CSS.

## Features

- User authentication (login, register, profile management)
- Product browsing with filtering and pagination
- Product details view
- Shopping cart functionality
- Checkout process

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **React Context API**: For state management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecomputer-frontend.git
   cd ecomputer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable UI components
  - `ui`: Basic UI components (Button, Input, etc.)
  - `layout`: Layout components (Header, Footer, etc.)
  - `products`: Product-related components
  - `cart`: Cart-related components
  - `auth`: Authentication-related components
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/services`: API services
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions

## Backend API

This frontend application is designed to work with the EComputer backend API. The API endpoints are defined in the `src/services` directory.

## License

This project is licensed under the MIT License.
