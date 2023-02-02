import {useEffect, useState, useRef} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import Card from '../Components/Card';
import {uniqueElementsArray} from '../Utils/Constant';
import {getData, shuffleCards, storeData} from '../Utils/Helpers';

export default function HomeScreen() {
  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray)),
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [bestScore, setBestScore] = useState('' || Number.POSITIVE_INFINITY);
  const [bestScoreList, setBestScoreList] = useState([]);
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
      const highScore = bestScore == 0 ? moves : Math.min(moves, bestScore);
      setBestScore(highScore);
      setShowModal(true);
      setBestScoreList([...bestScoreList, moves]);
      storeData('bestScores', [...bestScoreList, moves]);
    }
  };
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards(prev => ({...prev, [cards[first].type]: true}));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };
  const handleCardClick = index => {
    if (openCards.length === 1) {
      setOpenCards(prev => [...prev, index]);
      setMoves(moves => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]); 

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = index => {
    return openCards.includes(index);
  };

  const checkIsInactive = card => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };

  useEffect(() => {
    if (showModal) {
      getData('bestScores').then(r => {
        setShowModal(false);
        setTimeout(() => {
          const bestArray =
            r == null ? [] : r?.sort((a, b) => a - b).slice(0, 5);
          setBestScoreList(bestArray);
        }, 1000);
      });
    }
  }, [showModal]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Play the Flip card game{'\n'} {'\n'}
        Select two cards with same content consequtively to make them vanish
      </Text>

      <FlatList
        data={cards}
        renderItem={({item, index}) => (
          <Card
            key={index}
            card={item}
            index={index}
            isDisabled={shouldDisableAllCards}
            isInactive={checkIsInactive(item)}
            isFlipped={checkIsFlipped(index)}
            onClick={handleCardClick}
          />
        )}
        numColumns={4}
        keyExtractor={(item, index) => index}
      />

      <Text style={styles.text}>
        Moves: {moves}
        {'\n'} {'\n'}{bestScoreList?.length !==0 &&<Text>five Best Scores:{' '}
        {bestScoreList?.map(i => {
          return <Text>{i} </Text>;
        })}</Text>}
      </Text>

      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'left',
  },
});
