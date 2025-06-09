import axios from 'axios';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import Autocomplete from 'react-native-autocomplete-input';

const { BASE_URL } = Constants.expoConfig?.extra ?? {};

type ItemType = {
  label: string;
  value: string;
};

export default function HomeScreen() {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<string>('');
  const [items, setItems] = useState<ItemType[]>([]);
  const [gifUrl, setGifUrl] = useState('');
  const [selected, setSelected] = useState(false);

  const fetchTitles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/titles`);
      const fetchedTitles = response.data.titles.map((title: string, index: number) => ({
        label: title,
        value: title,
      }));
      setItems(fetchedTitles);
    } catch (error) {
      console.error('Failed to fetch titles:', error);
    }
  };

  const fetchExerciseDetails = async () => {
    if (!value || !selected) return;

    try {
      const res = await axios.get(`${BASE_URL}/exercises/search?title=${encodeURIComponent(value)}`);
      const exercise = res.data.exercise;

      setDescription(exercise.description || '');
      setGifUrl(exercise.gifUrl || '');
    } catch (err) {
      console.error('Failed to fetch exercise details:', err);
      setDescription('Failed to fetch exercise details:' + err);
      setGifUrl('');
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ color: '#fff' }}>Fit Check - Exercise</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ color: '#fff' }}>Search Exercise</ThemedText>
        <View style={styles.autocompleteWrapper}>
          <Autocomplete
            data={
              value.length > 0
                ? items.filter(item =>
                  item.label.toLowerCase().includes(value.toLowerCase())
                )
                : items.slice(0, 10)
            }
            defaultValue={value}
            onChangeText={text => setValue(text)}
            placeholder="Select or type an exercise..."
            flatListProps={{
              keyExtractor: (item) => item.value,
              keyboardShouldPersistTaps: 'handled',
              nestedScrollEnabled: true, // <- important
              renderItem: ({ item }) => (
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => {
                    setValue(item.label);
                    setSelected(true);
                    Keyboard.dismiss();
                    fetchExerciseDetails();
                  }}
                >
                  <Text style={{ color: '#fff' }}>{item.label}</Text>
                </TouchableOpacity>
              ),
            }}
            containerStyle={{
              flex: 1,
              zIndex: 1000,
              backgroundColor: '#000',
            }}
            inputContainerStyle={{
              backgroundColor: '#000',
            }}
            listContainerStyle={{
              maxHeight: 200,
              zIndex: 1000,
              backgroundColor: '#000',
            }}
          />

          {/* Clear Button */}
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setValue('');
                setSelected(false);
                setItems([]);
              }}
            >
              <Text style={{ fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}

          {/* Fetch Button */}
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={() => {
              Keyboard.dismiss();
              fetchTitles();
            }}
          >
            <Text style={{ fontSize: 14 }}>Fetch</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <Image
        source={gifUrl ? gifUrl : require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.stepContainerTwo}>{description}</ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 60,
    padding: 16,
    backgroundColor: '#000',
  },
  stepContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
    zIndex: 1000,
    backgroundColor: '#000',
  },
  stepContainerTwo: {
    fontSize: 13,
    color: '#fff'
  },
  reactLogo: {
    height: 300,
    width: 410,
  },
  searchButton: {
    margin: 1,
    backgroundColor: '#000',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autocompleteWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },

  clearButton: {
    padding: 8,
    marginLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fetchButton: {
    padding: 8,
    marginLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});