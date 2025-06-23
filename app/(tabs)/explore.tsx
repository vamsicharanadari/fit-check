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
  alternatives?: {
    title: string;
    table: string[][];
  }[];
}

interface MuscleGroup {
  title: string;
  exercises: Exercise[];
}

interface Routine {
  name: string;
  description: string;
  archive?: boolean;
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

  const gymRoutines = routines.filter(r => !r.archive);
  const archivedRoutines = routines.filter(r => r.archive);

  const renderRoutineSection = (title: string, routineList: Routine[]) => (
    <>
      <ThemedView style={styles.sectionTitleContainer}>
        <ThemedText style={{ fontSize: 25, paddingTop: 20 }} type="title">{title}</ThemedText>
      </ThemedView>
      {routineList.map((routine, routineIdx) => (
        <ThemedView key={routineIdx} style={styles.routineContainer}>
          <Collapsible title={routine.name}>
            {routine.groups?.map((group, groupIdx) => (
              <ThemedView key={groupIdx} style={styles.groupContainer}>
                <Collapsible title={group.title}>
                  {group.exercises.map((exercise, exIdx) => (
                    <ThemedView key={exIdx}>
                      <ThemedText style={styles.titleText}>{exercise.title}</ThemedText>
                      <Table headers={headersWeights} data={exercise.table} />
                      &nbsp;
                      {exercise.alternatives && exercise.alternatives.length > 0 && (
                        <Collapsible title="Alternatives">
                          {exercise.alternatives.map((alt, altIdx) => (
                            <ThemedView key={altIdx} style={styles.alternativeContainer}>
                              <ThemedText style={styles.altTitle}>{alt.title}</ThemedText>
                              <Table headers={headersWeights} data={alt.table} />
                            </ThemedView>
                          ))}
                        </Collapsible>
                      )}
                    </ThemedView>
                  ))}
                </Collapsible>
              </ThemedView>
            ))}
          </Collapsible>
        </ThemedView>
      ))}
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.exploreBlock}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      {renderRoutineSection('Gym Routines', gymRoutines)}
      {archivedRoutines.length > 0 && renderRoutineSection('Archived Routines', archivedRoutines)}
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
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  routineContainer: {
    padding: 10
  },
  groupContainer: {
    padding: 10
  },
  alternativeContainer: {
    paddingTop: 10,
    paddingLeft: 10
  },
  altTitle: {
    fontSize: 15,
    paddingBottom: 5
  }
});