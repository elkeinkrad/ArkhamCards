import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { createFactionIcons, FACTION_COLORS } from '../../constants';

const FACTION_ICONS = createFactionIcons(55, '#FFF');
const HEADER_SIZE = 48;

export default class PlayerCardImage extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      navigator,
      card,
    } = this.props;
    navigator.push({
      screen: 'Card.Image',
      passProps: {
        card,
      },
    });
  }

  imageStyle() {
    const {
      card,
    } = this.props;
    switch (card.type_code) {
      case 'enemy': return styles.enemyImage;
      case 'investigator': return styles.investigatorImage;
      case 'agenda': return styles.agendaImage;
      case 'act': return styles.actImage;
      case 'location': return styles.locationImage;
      default: return {};
    }
  }

  renderPlaceholder() {
    const {
      card,
    } = this.props;

    return (
      <View style={[
        styles.placeholder,
        { backgroundColor: FACTION_COLORS[card.faction_code] },
      ]}>
        <Text style={styles.placeholderIcon}>
          { FACTION_ICONS[card.faction_code] }
        </Text>
      </View>
    );
  }

  render() {
    const {
      card,
    } = this.props;
    const filename = (card.type_code === 'location' && card.double_sided) ?
      card.backimagesrc :
      card.imagesrc;

    if (!card.imagesrc) {
      return (
        <View style={styles.container}>
          { this.renderPlaceholder() }
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          { this.renderPlaceholder() }
          <View style={styles.container}>
            <CachedImage
              style={[styles.image, this.imageStyle()]}
              source={{
                uri: `https://arkhamdb.com${filename}`,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 6,
    width: 90,
    height: 90,
  },
  image: {
    position: 'absolute',
    top: -14,
    left: -18,
    width: 142 * 1.1,
    height: 198 * 1.1,
  },
  enemyImage: {
    position: 'absolute',
    top: -90,
    left: -25,
    width: 142 * 1.4,
    height: 198 * 1.4,
  },
  locationImage: {
    position: 'absolute',
    top: -17,
    left: -25,
    width: 142 * 1.4,
    height: 198 * 1.4,
  },
  investigatorImage: {
    top: -17,
    left: -10,
    width: 166 + 44,
    height: 136 + 34,
  },
  agendaImage: {
    top: -35,
    left: 0,
    height: 136 * 1.35,
    width: 166 * 1.35,
  },
  actImage: {
    top: -17,
    left: -65,
    height: 136 * 1.35,
    width: 166 * 1.35,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
  buttonRow: {
    width: '100%',
    height: HEADER_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    marginLeft: 4,
  },
});
