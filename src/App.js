import './App.css';
import {useEffect, useState} from 'react';

function App() {
  const [minions, setMinions] = useState([]);
  const [testArray, setTestArray] = useState([]);
  const [checked, setChecked] = useState([]);
  const [wins, setWins] = useState([0]);

  //use effect will grab array from API on page load

  useEffect(() => {
    const fetchPost = async () => {
       const response = await fetch(
          'https://dog.ceo/api/breeds/image/random/25'
       );
       const data = await response.json();
       console.log(data.message);
       setMinions(data.message);
    };
    fetchPost();
 }, []);

  useEffect(() => {
    //building the bingo board array
    //console.log(minions,'minions')
    let bingoArray = [];
    //const bingoArray = ['tile', 'tile', 'tile', 'tile', 'tile','tile', 'tile', 'tile', 'tile', 'tile','tile', 'tile', 'tile', 'tile', 'tile','tile', 'tile', 'tile', 'tile', 'tile','tile', 'tile', 'tile', 'tile', 'tile'];
    bingoArray = minions.map(minion =>minion);
    const numArray = []; 

    for(var i = 1; i <= 25; i++) {
      numArray.push(i);
    }

    let newArray2 = [];

    newArray2 = bingoArray.map( function(x, i){
      return {"name": x, "status": false, 'id': numArray[i]}        
    });

    setTestArray(newArray2);
                    
  }, [minions]); //minions

  //
  /* const [testArray, setTestArray] = useState([
    {name: 'tile',status: false, id: 0},{name: 'tile', status: false, id: 1},{name: 'tile',status: false, id: 2},{name: 'tile',status: false, id: 3},{name: 'tile',status: false, id: 4}
    ]); */

  //potential 

  const handleToggle = (koto) => {
    //console.log('working');
    //console.log(koto);
    const newArray = [...testArray];
    let newChecked = [...checked];
    const currentTile = newArray.find((tile) => tile.id === koto);

    if(currentTile.status === true){
      //update bingo array
      currentTile.status = false;
      setTestArray(newArray);

      //remove id of tile from checked array
      let removeItem = newChecked.indexOf(currentTile.id);
      if (removeItem !== -1) {
        newChecked.splice(removeItem, 1);
      }

      setChecked(newChecked); 
      //console.log('fin, removed tile from arrays');

    } else if(currentTile.status === false){
      //update bingo array
      currentTile.status = true;
      setTestArray(newArray);

      //add id of tile to checked array
      newChecked.push(currentTile.id);
      newChecked = newChecked.filter((item, index) => newChecked.indexOf(item) === index);

      setChecked(newChecked); 
      //console.log('fin, added tile to arrays');
    }
  }

  function handleReset(){
    const newArray3 = [...testArray];
    for(let k = 0; k < newArray3.length; k++){
      newArray3[k].status = false;
    }
    setTestArray(newArray3);
    //console.log(newArray3);
    setChecked([]);
    setWins([0]);
  }

  const useWin = (check) => {

    useEffect(() => {
    let bingoWins = 0;

     if (check.length >= 5){

      const winArray = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [5, 10, 15, 20, 25],
        [1, 7, 13, 19, 25],
        [5, 9, 13, 17, 21]
      ];

      for(var j = 0; j < winArray.length; j++) {
       let result =  winArray[j].every(function (element) {
          return check.includes(element);
        }) 

        if(result === true){
        // console.log(j,'bingo');
          bingoWins++;
        }
      }
      setWins(bingoWins);

     // console.log(checked,'this works');
      } 
    }, [check]);
    
  }

  const BingoBoard = ({testArray}) =>{
    useWin(checked);
    return(
      <div className="container">
          {/* {testArray.map((item) => (
            <Tile isActive={item.status} key={item.id} num={item.id} onToggle={() => handleToggle(item.id)}>
              {item.name}
            </Tile>))}
            */}
            {testArray.map(item => {
              return(
                <Tile isActive={item.status} key={item.id} num={item.id} onToggle={() => handleToggle(item.id)}>
                  {item.name}
                </Tile>
              )
            })}
      </div>
    );
  }

    //function for each single bingo tile
    function Tile({isActive, children, onToggle}){
      return (
        <div className={`block ${isActive ? "choose" : ""}`} onClick={onToggle}>
          <img src={children} alt="mount"/>
        </div>
      );
    }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bingo Board</h1>
      </header>
      {wins > 0 && <div className="bingo-win">Winner! You have {wins} bingo(s)!</div>}
      <div className="board">
        <BingoBoard testArray={testArray}/> 
      </div>
      <button className="clear" onClick={() => handleReset()}>Reset Board</button>
    </div>
  );
}

export default App;
