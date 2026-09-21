import React from 'react';
import { Screen } from '../src/ui/Screen';

// 8 REWARDS is not in stage 1. The tab exists because the bottom menu is on every signed in screen.
// The screen itself (price list from salon.app_price_list, filters, the lead line) is built later.
export default function Rewards() {
  return <Screen tab="rewards" title="Rewards">{null}</Screen>;
}
