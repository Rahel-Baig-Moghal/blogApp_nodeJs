import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';


let finalFilename = '';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    const originalFilename = file.originalname;
    const extension = originalFilename.split('.').pop();
    finalFilename = `${uniqueFilename}.${extension}`; // Store finalFilename in the outer scope
    cb(null, finalFilename);
  },
});






const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Route for the homepage
app.get("/", (req, res) => {
  const currentDir = process.cwd();
  const directoryPath = path.join(currentDir, "public", "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const imageFiles = files.filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png")
    );

    // Read the stories.json file
    fs.readFile(path.join(currentDir, "stories.json"), (err, data) => {
      if (err) {
        console.error("Error reading stories.json file:", err);
        return;
      }

      const stories = JSON.parse(data);

      // Transform stories array into an object with the desired structure
      const storiesObject = {};
      stories.forEach((story) => {
        const key = Object.keys(story)[0]; // Get the key of the story object
        storiesObject[key] = story[key]; // Add the story to the storiesObject
      });

      // Render the index.ejs template with imageFiles and storiesObject
      res.render("index.ejs", { imageFiles, storiesObject });
    });
  });
});


// Route for handling file upload
app.post("/upload", upload.single("file"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    res.status(400).send("No file uploaded");
    return;
  }

  const finalFilename = req.file.filename;
  const story = req.body.story;
  // Read existing stories from JSON file
  let storiesData = [];
  try {
    storiesData = JSON.parse(fs.readFileSync("stories.json", "utf8"));
  } catch (err) {
    console.error("Error reading stories file:", err);
  }

  // Check if any story already exists for the uploaded image
  const existingStoryIndex = storiesData.findIndex(
    (storyObj) =>
      Object.keys(storyObj)[0] === "public/uploads/" + finalFilename
  );

  if (existingStoryIndex !== -1) {
    // Update the existing story with the new one
    storiesData[existingStoryIndex]["public/uploads/" + finalFilename] = story;
  } else {
    // Add a new story
    storiesData.push({
      ["public/uploads/" + finalFilename]: story,
    });
  }

  // Write updated stories back to JSON file
  fs.writeFile("stories.json", JSON.stringify(storiesData, null, 2), (err) => {
    if (err) {
      console.error("Error writing stories file:", err);
    }
    // Redirect back to home page
    res.redirect("/");
  });
});


// Route for handling file deletion
app.post("/delete", (req, res) => {
  const { image } = req.body;
  console.log("Deleting image:", image);

  // Read the stories.json file
  fs.readFile('stories.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    // Parse the JSON data into a JavaScript array
    let stories = JSON.parse(data);

    // Find the index of the object with the specified image
    const index = stories.findIndex((story) => Object.keys(story)[0] === 'public/uploads/' + image);

    if (index !== -1) {
      // Remove the object from the array
      stories.splice(index, 1);

      // Delete the image file from the filesystem
      fs.unlink('public/uploads/' + image, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error deleting file");
          return;
        }

        console.log('File is deleted.');

        // Write the updated array back to the stories.json file
        fs.writeFile('stories.json', JSON.stringify(stories, null, 2), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating file");
            return;
          }

          console.log('File is updated.');
          res.redirect("/");
        });
      });
    } else {
      console.log('Image not found in stories.json');
      res.status(404).send("Image not found in stories.json");
    }
  });
});







app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
