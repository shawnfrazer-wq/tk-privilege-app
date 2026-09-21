import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { C } from '../theme';

const tkmark = require('../../assets/tkmark_white.png');

type Props = { filled: number; target: number };

// .boxes: the Care Card. A filled box is black with the white TK mark. An empty box has a dashed
// outline with the mark faded inside it.
export function CareCardBoxes({ filled, target }: Props) {
  const count = target || 4;
  return (
    <View style={s.boxes}>
      {Array.from({ length: count }).map((_, i) => {
        const isFilled = i < (filled || 0);
        return (
          <View key={i} style={[s.box, isFilled ? s.filled : s.empty]}>
            <Image source={tkmark} style={[s.mark, !isFilled && s.faint]} />
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: 8, marginTop: 12 },
  box: { flex: 1, height: 68, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  filled: { backgroundColor: C.ink, borderColor: C.ink },
  empty: { borderColor: '#CFCAC3', borderStyle: 'dashed', backgroundColor: C.paper },
  mark: { width: 36, height: 36 },
  faint: { tintColor: C.ink, opacity: 0.14 },
});
