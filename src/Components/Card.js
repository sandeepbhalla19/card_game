import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const Card = ({onClick, card, index, isInactive, isFlipped, isDisabled}) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
    <View style={styles.container}>
      {!isInactive ? (
        <TouchableOpacity style={styles.card} onPress={handleClick}>
          <View>
            <Text style={styles.text}>{isFlipped ? card?.title : '?'}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 20,
    margin: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default Card;
