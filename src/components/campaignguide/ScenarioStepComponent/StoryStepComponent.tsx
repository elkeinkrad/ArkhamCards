import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BulletsComponent from './BulletsComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { StoryStep } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  step: StoryStep;
}

export default class StoreStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    return (
      <View style={styles.step}>
        { !!step.title && (
          <Text style={[typography.bigGameFont, { color: '#2E5344' }]}>
            { step.title }
          </Text>
        ) }
        { !!step.text && (
          <CampaignGuideTextComponent
            text={step.text.replace(/\n/g, '\n\n')}
            flavor
          />
        ) }
        <BulletsComponent bullets={step.bullets} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'column',
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
});
