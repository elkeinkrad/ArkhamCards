import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../../app/i18n';
import NavButton from '../../core/NavButton';
import WeaknessSetView from '../../weakness/WeaknessSetView';
import withWeaknessCards from '../../weakness/withWeaknessCards';
import typography from '../../../styles/typography';

class WeaknessSetSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    weaknessSet: PropTypes.object.isRequired,
    // From realm.
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showDrawDialog = this.showDrawDialog.bind(this);
  }

  showDrawDialog() {
    const {
      navigator,
      campaignId,
    } = this.props;
    navigator.push({
      screen: 'Dialog.CampaignDrawWeakness',
      title: L('Draw Weaknesses'),
      passProps: {
        campaignId,
      },
    });
  }

  render() {
    const {
      weaknessSet,
      cards,
    } = this.props;
    const counts = WeaknessSetView.computeCount(weaknessSet, cards);
    if (counts.total === 0) {
      return null;
    }
    return (
      <NavButton onPress={this._showDrawDialog}>
        <View style={styles.padding}>
          <Text style={typography.text}>
            { L('Basic Weakness Set') }
          </Text>
          <Text style={typography.small}>
            { L('{{assignedCount}} / {{totalCount}} have been drawn.', {
              assignedCount: counts.assigned,
              totalCount: counts.total,
            }) }
          </Text>
        </View>
      </NavButton>
    );
  }
}

export default withWeaknessCards(WeaknessSetSection);

const styles = StyleSheet.create({
  padding: {
    padding: 6,
  },
});
