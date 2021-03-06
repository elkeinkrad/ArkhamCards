import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { forEach } from 'lodash';
import database from '@react-native-firebase/database';
import { ngettext, msgid, t } from 'ttag';
import { useObjectVal } from 'react-firebase-hooks/database';

import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import space from '@styles/space';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import { useTextDialog } from '@components/deck/dialogs';
import { ArkhamCardsProfile, FriendStatus } from '@data/firebase/types';
import { NavigationProps } from '@components/nav/types';
import { Navigation } from 'react-native-navigation';
import { FriendsViewProps } from '../FriendsView';
import { useUpdateHandle } from '@data/firebase/api';
import StyleContext from '@styles/StyleContext';

export default function ArkhamCardsAccountDetails({ componentId }: NavigationProps) {
  const { typography } = useContext(StyleContext);
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const [profile, loadingProfile] = useObjectVal<ArkhamCardsProfile>(user ? database().ref('/profiles').child(user.uid) : undefined);
  const updateHandle = useUpdateHandle();
  const { dialog, showDialog } = useTextDialog({
    title: t`Account Name`,
    value: profile?.handle || '',
    onValidate: updateHandle,
    placeholder: t`Choose a handle for your account`,
  });
  const editFriendsPressed = useCallback(() => {
    if (user) {
      Navigation.push<FriendsViewProps>(componentId, {
        component: {
          name: 'Friends',
          passProps: {
            userId: user.uid,
          },
          options: {
            topBar: {
              title: {
                text: t`Your Friends`,
              },
            },
          },
        },
      });
    }
  }, [componentId, user]);
  const friends = profile?.friends;
  const [friendCount, pendingFriendCount] = useMemo(() => {
    let friendCount = 0;
    let pendingFriendCount = 0;
    forEach(friends || {}, status => {
      if (status === FriendStatus.FRIENDS) {
        friendCount++;
      } else if (status === FriendStatus.RECEIVED) {
        pendingFriendCount++;
      }
    });
    return [friendCount, pendingFriendCount];
  }, [friends]);
  if (!user) {
    return (
      <View style={[space.paddingBottomS, space.paddingTopS, space.paddingSideS]}>
        <Text style={typography.text}>{t`This app works just fine without an account.\nBut signing in will allow you to sync campaigns between devices, with more features planned for the future.`}</Text>
      </View>
    );
  }
  const requestLabel = pendingFriendCount > 0 ? ngettext(msgid`${pendingFriendCount} pending request`, `${pendingFriendCount} pending requests`, pendingFriendCount) : undefined;
  const label = ngettext(msgid`${friendCount} friend`, `${friendCount} friends`, friendCount);
  return (
    <View style={[space.paddingTopS]}>
      <DeckPickerStyleButton
        icon="name"
        editable
        title={t`Account name`}
        valueLabel={loading || loadingProfile ? t`Loading` : (profile?.handle || t`Choose a handle`)}
        onPress={showDialog}
        first
      />
      <DeckPickerStyleButton
        icon="per_investigator"
        editable
        title={t`Friends`}
        valueLabel={requestLabel || label}
        valueLabelDescription={requestLabel ? label : undefined}
        onPress={editFriendsPressed}
        editIcon="plus-thin"
        last
      />
      { dialog }
    </View>
  );
}
