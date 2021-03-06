import { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';

import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

function App() {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() =>{
    const loadAll = async() => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      var randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      var chosen = originals[0].items.results[randomChosen];
      var choseninfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(choseninfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[]);

  return (
    <div className="page">
      <Header black={blackHeader}/>      
      {featuredData && 
        <FeaturedMovie 
          item={featuredData}
        />
      }
      <section className="lists" >
        { movieList.map((item,key) => (
          <MovieRow 
            key={key} 
            title={item.title}
            items={item.items}
            />
        )) }
      </section>

      <footer>
        Made by Romulo Vieira <br/>
        Image rights for Netflix <br/>
        Data taken from Themoviedb.org 
      </footer>

      {movieList.length <= 0 || featuredData === null ?
        <div className="loading">
          <img 
            src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" 
            alt="Loading"/>
        </div>
      : <> </>}
    </div>
  );
}

export default App;
