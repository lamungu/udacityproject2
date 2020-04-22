import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Displays a simple message to the user
  app.get( "/filteredimage", async (req, res) => {
    const imageUrl: string|null = req.query.image_url

    // Check if the image URL is existing
    if (!imageUrl) {
        return res.status(400).send({ message: 'image URL is required' });
    }

    try {
        let filePath = await filterImageFromURL(req.query.image_url);
        res.sendFile(filePath, (error) => {
            if (error) {
                res.status(500).send('Error while transfering file');
            }
            deleteLocalFiles([filePath])
        });
    } catch (e) {
        // Catch the error if one occurs
        res.status(400).send({ message: 'An error has occured. Please verify your image URL'})
    }
    
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();