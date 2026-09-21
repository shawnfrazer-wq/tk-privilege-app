import React from 'react';
import { View } from 'react-native';
import { GAP } from '../theme';

// .gap-s, .gap, .gap-l
export const Gap = ({ size = 'm' }: { size?: 's' | 'm' | 'l' }) => <View style={{ height: GAP[size] }} />;
