import { useState } from "react";
import "./App.css";
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker.js";
import { Board } from "./TicTacToe.jsx";

function toUnquotedJSON(param){ // Implemented by Frostbolt Games 2022
  if(Array.isArray(param)){ // In case of an array, recursively call our function on each element.
      let results = [];
      for(let elem of param){
          results.push(toUnquotedJSON(elem));
      }
      return "[" + results.join(",") + "]";
  }
  else if(typeof param === "object"){ // In case of an object, loop over its keys and only add quotes around keys that aren't valid JavaScript variable names. Recursively call our function on each value.
      let props = Object
          .keys(param)
          .map(function(key){
              // A valid JavaScript variable name starts with a dollar sign (?), underscore (_) or letter (a-zA-Z), followed by zero or more dollar signs, underscores or alphanumeric (a-zA-Z\d) characters.
              if(key.match(/^[a-zA-Z_$][a-zA-Z\d_$]*$/) === null) // If the key isn't a valid JavaScript variable name, we need to add quotes.
                  return `"${key}":${toUnquotedJSON(param[key])}`;
              else
                  return `${key}:${toUnquotedJSON(param[key])}`;
          })
          .join(",");
      return `{${props}}`;
  }
  else{ // For every other value, simply use the native JSON.stringify() function.
      return JSON.stringify(param);
  }
}

const aleoWorker = AleoWorker();
function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const [squares, setSquares] = useState({
    r1: { c1: "0u8", c2: "0u8", c3: "0u8" },
    r2: { c1: "0u8", c2: "0u8", c3: "0u8" },
    r3: { c1: "0u8", c2: "0u8", c3: "0u8" },
  });

  const [playerTurn, setPlayerTurn] = useState(1);

  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute(r, c) {
    setExecuting(true);
    console.log([`${playerTurn}u8`, `${r}u8`, `${c}u8`, toUnquotedJSON(squares).replaceAll("\"", "")])
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "make_move",
      [`${playerTurn}u8`, `${r}u8`, `${c}u8`, toUnquotedJSON(squares).replaceAll("\"", "")],
    );
    setExecuting(false);
    let squareCopy = squares;
    squareCopy[`r${r}`][`c${c}`] = `${playerTurn}u8`;
    setSquares(squareCopy);
    setPlayerTurn(playerTurn === 1 ? 2 : 1);

    console.log(result);
  }

  return (
    <div style={{backgroundColor: "white"}}>
      <h1>Aleo + React</h1>
      <div className="card">
        <p>
          <button onClick={generateAccount}>
            {account
              ? `Account is ${JSON.stringify(account)}`
              : `Click to generate account`}
          </button>
        </p>
      </div>
      <Board squares={squares} onPlay={execute} />
    </div>
  );
}

export default App;
