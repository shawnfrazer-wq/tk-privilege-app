import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { num } from '../format';
import { C, F } from '../theme';

const tkmark = require('../../assets/tkmark_white.png');

type Props = { filled: number; target: number; rewardPoints: number };

// .boxes: the Care Card. A filled box is black with the white TK mark. An empty box has a dashed
// outline with the mark faint inside it, and the last empty box shows what a full card is worth.
export function CareCardBoxes({ filled, target, rewardPoints }: Props) {
  const count = target || 4;
  return (
    <View style={s.boxes}>
      {Array.from({ length: count }).map((_, i) => {
        const isFilled = i < (filled || 0);
        const isLast = i === count - 1;
        return (
          <View key={i} style={[s.box, isFilled ? s.filled : s.empty]}>
            {isFilled ? (
              <Image source={tkmark} style={s.mark} />
            ) : isLast ? (
              <Text style={s.reward}>+{num(rewardPoints)}</Text>
            ) : (
              <Image source={tkmark} style={[s.mark, s.faint]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: 8, marginTop: 12 },
  box: { flex: 1, height: 44, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  filled: { backgroundColor: C.ink, borderColor: C.ink },
  empty: { borderColor: '#CFCAC3', borderStyle: 'dashed', backgroundColor: C.paper },
  mark: { width: 26, height: 26 },
  faint: { tintColor: C.ink, opacity: 0.14 },
  reward: { fontFamily: F.med, fontSize: 11, color: C.gold },
});
