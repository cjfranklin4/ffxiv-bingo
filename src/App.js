import {useEffect, useState} from 'react';
import {Grid, GridItem, Button,Heading,Flex,useColorMode,useColorModeValue,Box } from '@chakra-ui/react'
import { Icon,SunIcon, MoonIcon } from '@chakra-ui/icons'
import { BsGithub } from 'react-icons/bs'

function App() {
  const [minions, setMinions] = useState([]);
  const [testArray, setTestArray] = useState([]);
  const [checked, setChecked] = useState([]);
  const [wins, setWins] = useState([0]);

  //use effect will grab array from API on page load
  useEffect(() => {
    const fetchPost = async () => {
       const response = await fetch(
          'https://ffxivcollect.com/api/mounts?limit=25'
       );
       const data = await response.json();
       //console.log(data.results);
       setMinions(data.results);
    };
    fetchPost();
 }, []);

  useEffect(() => {
    //building the bingo board array
    let bingoArray = [];
    bingoArray = minions.map(minion =>minion.image);
    const numArray = []; 

    for(var i = 1; i <= 25; i++) {
      numArray.push(i);
    }

    let newArray2 = [];

    newArray2 = bingoArray.map( function(x, i){
      return {"name": x, "status": false, 'id': numArray[i]}        
    });

    setTestArray(newArray2);
                    
  }, [minions]);

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
      <Grid
        maxW='600px'
        templateColumns='repeat(5, 1fr)'
        gap={5}
        >
            {testArray.map(item => {
              return(
                <Tile isActive={item.status} key={item.id} num={item.id} onToggle={() => handleToggle(item.id)}>
                  {item.name}
                </Tile>
              )
            })}
      </Grid>
    );
  }

    //function for each single bingo tile
    function Tile({isActive, children, onToggle}){
      return (
        <GridItem 
          colSpan={1}
          w='100px'
          h='100px'
          borderWidth={`${isActive ? "5px" : "2px"}`} 
          borderColor={`${isActive ? "orange.400" : 'teal' }`} 
          onClick={onToggle}
          borderRadius='5'
          overflow='hidden'
        >
          <img src={children} alt="mount"/>
        </GridItem>
      );
    }

    //Chakra UI things
    const { colorMode, toggleColorMode } = useColorMode()
    const bgGrad = useColorModeValue('linear(to-br,gray.100, gray.50)', 'linear(to-br, gray.800, gray.700, gray.800)')
  
  return (
    <Flex 
      direction='column'
      align='center'
      bgGradient={bgGrad}
      h='100vh'
    >
      <Flex 
        direction='column'
        align='center'
      >
        <Heading mt={5} mb={5}>FFXIV Mount Bingo</Heading>

        <Button 
          onClick={toggleColorMode}
          colorScheme='teal' 
          variant='solid' 
          mb={5}
          textAlign='center'
        >
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}

        {colorMode === 'light' ? <MoonIcon ml={2}/>  : <SunIcon ml={2}/>}
        </Button>
      </Flex>
      {wins > 0 && <Heading as='h2' mb={5} className="bingo-win">Winner! You have {wins} bingo(s)!</Heading>}
        <BingoBoard testArray={testArray}/> 
      <Button 
        colorScheme='teal' 
        variant='outline'
        onClick={() => handleReset()}
        mt={5} 
        mb={5}
      >Reset Board</Button>
      <Box as='a' href='https://github.com/cjfranklin4/ffxiv-bingo'>
        <Icon as={BsGithub} color='teal'  _hover={{
          color: "teal.300",
          }}/>
      </Box>
    </Flex>
  );
}

export default App;
