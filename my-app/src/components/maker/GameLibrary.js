import './Maker.css';
import React, { useState, useEffect } from 'react';
import TopMenu from '../shared/TopMenu';
import BottomMenu from './shared/BottomMenu';

const GameLibrary = () => {
    const [data, setData] = useState([
      {
        "game_id": 1, 
        "game_name": "skibidi in ohio",
        "game_bg": "./backgrounds/test1.jpg",
      },
      {
        "game_id": 2,
        "game_name": "bladee and kai cenat pog",
        "game_bg": "./backgrounds/test2.jpg",
      }
    ]);
    const [grid, setGrid] = useState(null);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(); 
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result);
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[])

    useEffect(() => {
        if (data == null) {
            return; 
        }

        let libraryList = []; 

        data.forEach(function(i) {
          console.log(i)
          libraryList.push(
            <div style={{ backgroundImage: `url(${i.game_bg})` }} className='LibraryGridView'>
                <p style={{margin: '2px 8px'}}>{i.game_name}</p>

            </div>
          );
        })
        
        setGrid(libraryList); 
    }, [data])

    return(
    <div className="MakerPage">
      <TopMenu color="#df79ce" />
        <div className={"MakerPage"}>
          <div className={"LibraryMenu darumadrop-one-regular"}>
            <p style={{fontSize:100, color: 'black', margin: '2px 50px'}}>Library</p>
            <div className='grid-container'>
              {grid}

            </div>
          </div>
        </div>
      {/* </div> */}
      <BottomMenu />
    </div>
  );
}; 

export default GameLibrary;