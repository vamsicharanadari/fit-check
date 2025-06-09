import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";

type TableProps = {
  headers: string[];
  data: string[][];
};

export default function Table({ headers, data }: TableProps) {
  return (
    <ThemedView>
      <View style={{ marginTop: 16 }}>
        <View style={{ borderWidth: 1, borderColor: '#ccc' }}>
          {/* Header Row */}
          <View style={{ flexDirection: 'row', backgroundColor: '#333' }}>
            {headers.map((header, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  borderRightWidth: index < headers.length - 1 ? 1 : 0,
                  borderColor: '#ccc',
                  padding: 8,
                }}
              >
                <ThemedText type="defaultSemiBold">{header}</ThemedText>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
              {row.map((cell, colIndex) => (
                <View
                  key={colIndex}
                  style={{
                    flex: 1,
                    borderRightWidth: colIndex < row.length - 1 ? 1 : 0,
                    borderBottomWidth: rowIndex < data.length - 1 ? 1 : 0,
                    borderColor: '#ccc',
                    padding: 8,
                  }}
                >
                  <ThemedText>{cell}</ThemedText>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}