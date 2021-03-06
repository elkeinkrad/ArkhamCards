import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space, { s, xs } from '@styles/space';
import COLORS from '@styles/colors';
import ArkhamIcon from '@icons/ArkhamIcon';
import EncounterIcon from '@icons/EncounterIcon';

export type DeckButtonIcon = 'draw' | 'tdea' | 'tdeb' | 'tools' | 'difficulty' | 'chaos_bag' | 'chart' | 'elder_sign' | 'delete' | 'per_investigator' | 'settings' | 'book' | 'arkhamdb' | 'plus-thin' | 'dismiss' | 'check-thin' | 'upgrade' | 'edit' | 'email' | 'login' | 'logo';

interface Props {
  title: string;
  detail?: string;
  icon?: DeckButtonIcon;
  color?: 'red' | 'red_outline' | 'gold' | 'gray';
  onPress?: () => void;
  rightMargin?: boolean;
  thin?: boolean;
  shrink?: boolean;
  loading?: boolean;
  bottomMargin?: number;
  topMargin?: number;
  disabled?: boolean;
}

const ICON_SIZE = {
  tdea: 28,
  tdeb: 28,
  tools: 26,
  difficulty: 26,
  chaos_bag: 26,
  chart: 26,
  elder_sign: 26,
  delete: 26,
  per_investigator: 26,
  settings: 26,
  book: 22,
  'draw': 24,
  'arkhamdb': 24,
  'logo': 28,
  'login': 24,
  'email': 24,
  'edit': 24,
  'upgrade': 34,
  'plus-thin': 24,
  'dismiss': 22,
  'check-thin': 30,
};
const ICON_STYLE = {
  draw: {},
  tdea: {},
  tdeb: {},
  tools: {},
  difficulty: {},
  chaos_bag: {},
  chart: {},
  elder_sign: {},
  delete: {},
  per_investigator: {},
  settings: {},
  book: {},
  'arkhamdb': {},
  'logo': {},
  'login': {},
  'email': {},
  'check-thin': {
    marginTop: -6,
  },
  'edit': {},
  'upgrade': {
    marginTop: 0,
  },
  'dismiss': {},
  'plus-thin': {},
};

const MATERIAL_ICONS = new Set(['email', 'delete', 'login']);
const ARKHAM_ICONS = new Set(['per_investigator', 'elder_sign']);
const ENCOUNTER_ICONS = new Set(['tdea', 'tdeb']);
export default function DeckButton({
  disabled,
  title,
  detail,
  icon,
  color = 'gray',
  onPress,
  rightMargin,
  topMargin,
  thin,
  shrink,
  loading,
  bottomMargin,
}: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const backgroundColors = {
    red_outline: colors.D30,
    red: colors.warn,
    gold: colors.upgrade,
    gray: colors.D10,
  };
  const rippleColor = {
    red_outline: colors.D10,
    red: colors.faction.survivor.lightBackground,
    gold: colors.faction.dual.lightBackground,
    gray: colors.M,
  };
  const iconColor = {
    red_outline: colors.warn,
    red: COLORS.white,
    gold: COLORS.D20,
    gray: colors.L10,
  };
  const textColor = {
    red_outline: colors.L30,
    red: COLORS.L30,
    gold: COLORS.D30,
    gray: colors.L30,
  };
  const disabledTextColor = {
    red_outline: colors.L10,
    red: COLORS.L30,
    gold: COLORS.D10,
    gray: colors.L10,
  };
  const theIconColor = iconColor[color];
  const iconContent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator animating color={theIconColor} size="small" />;
    }
    if (!icon) {
      return null;
    }
    if (MATERIAL_ICONS.has(icon)) {
      return <MaterialIcons name={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
    }
    if (ARKHAM_ICONS.has(icon)) {
      return <ArkhamIcon name={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
    }
    if (ENCOUNTER_ICONS.has(icon)) {
      return <EncounterIcon encounter_code={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
    }
    return <AppIcon name={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
  }, [loading, icon, theIconColor]);
  const height = (detail ? 32 : 20) * fontScale + s * 2 + xs * 2;
  return (
    <Ripple
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: backgroundColors[color] },
        shrink ? undefined : styles.grow,
        rightMargin ? space.marginRightS : undefined,
        bottomMargin ? { marginBottom: bottomMargin } : undefined,
        topMargin ? { marginTop: topMargin } : undefined,
      ]}
      onPress={onPress}
      rippleColor={rippleColor[color]}
    >
      <View style={[
        styles.row,
        icon ? { justifyContent: 'flex-start' } : { justifyContent: 'center' },
        space.paddingSideXs,
        space.paddingTopS,
        space.paddingBottomS,
      ]}>
        { !!icon && (
          <View style={[
            styles.icon,
            space.marginLeftXs,
            space.marginRightS,
            thin ? { marginLeft: xs, width: 24, height: height - s * 2 } : { width: 32, height: height - s * 2 },
            loading ? undefined : ICON_STYLE[icon],
          ]}>
            { iconContent }
          </View>
        ) }
        <View style={[styles.column, space.paddingRightS, !icon ? space.paddingLeftS : undefined, shrink ? undefined : styles.grow, space.paddingTopXs]}>
          <Text numberOfLines={1} ellipsizeMode="clip" style={[detail ? typography.large : typography.cardName, { color: disabled ? disabledTextColor[color] : textColor[color] }]}>
            { title }
          </Text>
          { !!detail && (
            <Text style={[typography.smallButtonLabel, { marginTop: 1, color: textColor[color] }]} numberOfLines={2}>
              { detail }
            </Text>
          ) }
        </View>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
  },
  grow: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
