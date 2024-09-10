import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({numJokesToGet = 5}) => {

  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  const getJokes = async () =>{
    try {
      // Load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();
  
      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });

        let{...joke} = res.data;

        if(!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
            jokes.push({...joke, votes: 0});
        }
      }
      setJokes(jokes);
      setIsLoading(false);
    } 
    catch (error) {
      console.error(error);  
    }
  }


  useEffect(() => {
    getJokes();
  }, [numJokesToGet]);

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    setJokes(jokes.map( j => 
      j.id === id ? { ...j, votes: j.votes + delta } : j
    ));
  };
  
  let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes);
  
  return(
    <div>
      <h1>JokeList</h1>

      <button
      className="JokeList-getmore"
      onClick={generateNewJokes}>
        Get New Jokes
      </button>

        {isLoading ? (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      ) : (
        sortedJokes.map(j => (
          <Joke
            key={j.id}
            id={j.id}
            text={j.joke}
            votes={j.votes}
            vote={vote}
          />
        ))
      )}

      

    </div>
  ) 
}
export default JokeList;