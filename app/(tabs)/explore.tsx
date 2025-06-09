import { Collapsible } from '@/components/Collapsible';
import Table from '@/components/table';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const { BASE_URL } = Constants.expoConfig?.extra ?? {};

const headersWeights = ['Set', 'Reps', 'Weight'];

interface Exercise {
  title: string;
  table: string[][];
}

interface MuscleGroup {
  title: string;
  exercises: Exercise[];
}

interface Routine {
  name: string;
  description: string;
  groups: MuscleGroup[];
}

export default function TabTwoScreen() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  const fetchRoutines = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/routines`);
      setRoutines(res.data.routines);
    } catch (err) {
      console.error('Error fetching routines:', err);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.exploreBlock}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText style={{ paddingBottom: 10 }}>Routines workouts for everyday Gym.</ThemedText>
      <ThemedView style={{
        paddingBottom: 20,
        backgroundColor: '#000'
      }}>
        {routines.map((routine, routineIdx) => (
          <ThemedView key={routineIdx} style={{
            padding: 10
          }}>
            <Collapsible title={routine.name}>
              {routine.groups?.map((group, groupIdx) => (
                <ThemedView key={groupIdx} style={{
                  padding: 10
                }}>
                  <Collapsible title={group.title}>
                    {group.exercises.map((exercise, exIdx) => (
                      <ThemedView key={exIdx}>
                        <ThemedText style={styles.titleText}>{exercise.title}</ThemedText>
                        <Table headers={headersWeights} data={exercise.table} />
                      </ThemedView>
                    ))}
                  </Collapsible>
                </ThemedView>
              ))}
            </Collapsible>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 20,
    backgroundColor: '#000'
  },
  titleText: {
    paddingTop: 15
  },
  exploreBlock: {
    paddingTop: 60,
    paddingLeft: 25,
    backgroundColor: '#000'
  }
});