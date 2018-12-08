let express = require("express");
let pageRouter = express.Router();
const {Page, User} = require('../models');
const jsonParser = express.json();

//Validates then creates a new page
pageRouter.post('/', jsonParser, (req, res) => {
  const neededKeys = ["title", "summary", "searchQueries", "sections"];
  for(let i = 0; i < neededKeys.length; i++) {
    let key = neededKeys[i];
    if(!(key in req.body)) {
      res.send(`Error, ${key} is not in the request body`);
    }
  }



    Page.findOne({title: req.body.title})
    .then(page => {
      if(!page) {
      	const newPage = {title: req.body.title, summary: req.body.summary, searchQueries: req.body.searchQueries,
         sections: req.body.sections
      	}

      	Page.create(newPage)
      	.then(function(app){
      		res.status(201).json(app.serialize());
      	})
      }
      else {
      	res.status(400).send("This page already exists, if you are seeing this message, please contact the creator of the website!");
      }	
    })
    .catch(err => {
      res.status(500).send("Internal Server Error");
    })
  });

//After validation, returns the page at the given address
pageRouter.get('/:title', (req, res) => {
  const requiredKey = "title";
  
  if(!(requiredKey in req.params)) {
    res.status(401).send("Error: Title not included in the request parameter");
  };
  
  Page.findOne({title: req.params.title})
  .then(_page => {
     res.status(200).json(_page.serialize()); 
  })
  .catch(err => {
    res.status(400).send("No page found at this address");
  })
})


pageRouter.get('/', (req, res) => {
  
  Page.find()
  .then(_pages => {
     res.status(200).json(_pages.map(page => page.serialize())); 
  })
  .catch(err => {
    res.status(400).send("No page found at this address");
  })
})


//Deletes a application based on the username and name of application provided
pageRouter.delete('/', jsonParser, (req, res) => {
  neededKeys = ["title"];
  for(let i = 0; i < neededKeys.length; i++) {
    if(!(neededKeys[i] in req.body)) {
      return res.status(400).send(`${neededKeys[i]} not found in request body`); 
    }
  } 

    Page.findOneAndDelete({title: req.body.title})
    .then(function() {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).send("Internal Server Error");
    })
  })




pageRouter.put('/', jsonParser, (req, res) => {
  const neededKeys = ["title", "summary", "sections"];
  for(let i = 0; i < neededKeys.length; i++) {
    let key = neededKeys[i];
    if(!(key in req.body)) {
      res.send(`Error, ${key} is not in the request body`);
    }
  }

    Page.findOneAndUpdate({title: req.body.title}, {summary: req.body.summary, sections: req.body.sections})
    .then(page => {        
      res.status(201).json(page.serialize());
    });
});


  
  
module.exports = pageRouter;