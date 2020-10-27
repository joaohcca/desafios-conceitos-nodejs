const express = require("express");
const cors = require("cors");

const { v4: uuid, v4: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
   
  const { id } = request.params;

  if ( !isUuid(id) ) {
      return response.status(400).json({ error: 'Invalid projectID'});  
  }

  return next();
  //only allow code to proceed if uuid is a valid uuidv4 format
}

app.use('/repositories/:id', validateRepositoryId)
//add validator to all routes with :id as param

app.get("/repositories", (request, response) => {
  //list all repositories
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  // create new repository entry with 0 likes
  
  const {title, url, techs } = request.body

  const repository = { id: uuid(),
    'title': title,
    'url': url,
    'techs': techs,
    'likes': 0
  }
  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  //update repository title,url and techs for a given repository id
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)

  if (repositoryIndex < 0 ){
    return response.status(400).json({ 'error': 'Repository not found'})
  }

  const {title, url, techs } = request.body
  const likes = repositories[repositoryIndex].likes
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  //delete repository and give 204 as response
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)

  if (repositoryIndex < 0 ){
    return response.status(400).json({ 'error': 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  //increment likes on a post
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)

  if (repositoryIndex < 0 ){
    return response.status(400).json({ 'error': 'Repository not found'})
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex])

});

module.exports = app;
