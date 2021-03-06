import React, { useCallback, useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import CampaignGuideSummary from './CampaignGuideSummary';
import { Campaign, CampaignId } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import ScenarioListComponent from '@components/campaignguide/ScenarioListComponent';
import useTabView from '@components/core/useTabView';
import { updateCampaign } from '@components/campaign/actions';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import CampaignGuideContext from './CampaignGuideContext';
import { useStopAudioOnUnmount } from '@lib/audio/narrationPlayer';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import CampaignGuideFab from './CampaignGuideFab';
import { useAlertDialog, useTextDialog } from '@components/deck/dialogs';
import useTraumaDialog from '@components/campaign/useTraumaDialog';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps;

function CampaignGuideView(props: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { componentId } = props;
  const campaignData = useContext(CampaignGuideContext);
  const campaignId = campaignData.campaignId;
  const dispatch = useDispatch();
  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, componentId]);
  const { showTraumaDialog, traumaDialog } = useTraumaDialog({ hideKilledInsane: true });

  const { dialog, showDialog: showEditNameDialog } = useTextDialog({
    title: t`Name`,
    value: campaignData.campaignName,
    onValueChange: updateCampaignName,
  });

  useStopAudioOnUnmount();
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const saveCampaignUpdate = useCallback((campaignId: CampaignId, sparseCampaign: Partial<Campaign>, now?: Date) => {
    dispatch(updateCampaign(campaignId, sparseCampaign, now));
  }, [dispatch]);
  const { campaignGuide, campaignState } = campaignData;
  const processedCampaign = useMemo(() => campaignGuide.processAllScenarios(campaignState), [campaignGuide, campaignState]);
  const [removeMode, toggleRemoveInvestigator] = useFlag(false);
  const addInvestigatorPressed = useCallback(() => {
    campaignState.showChooseDeck();
  }, [campaignState]);
  const [alertDialog, showAlert] = useAlertDialog();
  const decksTab = useMemo(() => {
    return (
      <SafeAreaView style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle} showsVerticalScrollIndicator={false}>
          <View style={[space.paddingSideS, space.paddingBottomL]}>
            <RoundedFactionBlock
              faction="neutral"
              noSpace
              header={
                <CampaignGuideSummary
                  inverted
                  difficulty={processedCampaign.campaignLog.campaignData.difficulty}
                  campaignGuide={campaignGuide}
                />
              }
              footer={removeMode ? (
                <RoundedFooterButton
                  icon="check"
                  title={t`Finished removing investigators`}
                  onPress={toggleRemoveInvestigator}
                />
              ) : (
                <RoundedFooterButton
                  icon="expand"
                  title={t`Add Investigator`}
                  onPress={addInvestigatorPressed}
                />
              )}
            >
              <CampaignInvestigatorsComponent
                componentId={componentId}
                showAlert={showAlert}
                updateCampaign={saveCampaignUpdate}
                campaignData={campaignData}
                processedCampaign={processedCampaign}
                showTraumaDialog={showTraumaDialog}
                removeMode={removeMode}
              />
            </RoundedFactionBlock>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }, [componentId, backgroundStyle, removeMode, campaignData, processedCampaign, campaignGuide,
    addInvestigatorPressed, toggleRemoveInvestigator, saveCampaignUpdate, showTraumaDialog, showAlert,
  ]);
  const scenariosTab = useMemo(() => {
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <ScenarioListComponent
            showAlert={showAlert}
            campaignId={campaignId}
            campaignData={campaignData}
            processedCampaign={processedCampaign}
            componentId={componentId}
          />
        </ScrollView>
      </View>
    );
  }, [backgroundStyle, campaignData, campaignId, processedCampaign, componentId, showAlert]);
  const logTab = useMemo(() => {
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <CampaignLogComponent
            campaignId={campaignId.campaignId}
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            componentId={componentId}
          />
        </ScrollView>
      </View>
    );
  }, [backgroundStyle, campaignId, campaignGuide, processedCampaign.campaignLog, componentId]);
  const tabs = useMemo(() => [
    {
      key: 'investigators',
      title: t`Decks`,
      node: decksTab,
    },
    {
      key: 'scenarios',
      title: t`Scenarios`,
      node: scenariosTab,
    },
    {
      key: 'log',
      title: t`Log`,
      node: logTab,
    },
  ], [decksTab, scenariosTab, logTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs });
  return (
    <View style={styles.wrapper}>
      { tabView }
      <CampaignGuideFab
        setSelectedTab={setSelectedTab}
        campaignId={campaignData.campaignId}
        componentId={componentId}
        campaignName={campaignData.campaignName}
        removeMode={removeMode}
        showEditNameDialog={showEditNameDialog}
        showAddInvestigator={addInvestigatorPressed}
        toggleRemoveInvestigator={toggleRemoveInvestigator}
        guided
        showAlert={showAlert}
      />
      { alertDialog }
      { dialog }
      { traumaDialog }
    </View>
  );
}

export default withCampaignGuideContext<CampaignGuideProps & NavigationProps>(CampaignGuideView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
