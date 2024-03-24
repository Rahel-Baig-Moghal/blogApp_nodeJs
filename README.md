# NodeJs File Upload and Management Project

This is a Node.js project that allows users to upload images with accompanying stories. The uploaded images and stories are stored in a JSON file for later retrieval and display.

## Prerequisites

Before running this project, you need to have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` in the project directory.

## Usage

1. Start the server by running `npm start`.
2. Open your web browser and navigate to `http://localhost:3000` to access the application.
3. Upload an image and add a story to save them.
4. The uploaded images and stories will be displayed on the homepage.
5. To delete an image and its associated story, click the delete button below the image on the homepage.

## Technologies Used

- Node.js
- Express.js
- Multer
- fs (File System)
- uuid (Universally Unique Identifier)

## File Structure

```
.
├── node_modules/ # Dependencies
├── public/ # Static files (uploads, stylesheets, etc.)
├── views/ # EJS templates
├── index.js # Main application file
├── package-lock.json # Dependency lock file
├── package.json # Project metadata and dependencies
└── stories.json # JSON file to store uploaded images and stories
```


## Author

Rahel Baig Moghal

## Deployment

This project is deployed on [Render](https://blogapp-nodejs.onrender.com).
