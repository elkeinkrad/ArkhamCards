import React, { useContext } from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideContext from '../../CampaignGuideContext';
import { CampaignLogEffect, FreeformCampaignLogEffect, BulletType } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  effect: CampaignLogEffect | FreeformCampaignLogEffect;
  input?: string[];
  numberInput?: number[];
  bulletType?: BulletType;
}

function CardEffectContent({ code, section }: { code: string; section: string }) {
  const { typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(code, 'encounter');
  if (loading) {
    return null;
  }
  if (!card) {
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
  return (
    <CampaignGuideTextComponent
      text={t`In your Campaign Log, under "${section}", record ${card.name}. `}
    />
  );
}

function CampaignLogEffectsContent({ effect, input }: {
  effect: CampaignLogEffect | FreeformCampaignLogEffect;
  input?: string[];
}) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  if (effect.type === 'freeform_campaign_log') {
    const text = input && input.length ?
      input[0] : 'Missing text entry';
    return (
      <CampaignGuideTextComponent
        text={t`In your Campaign Log, record that <i>${text}</i>`}
      />
    );
  }
  if (effect.id) {
    const logEntry = campaignGuide.logEntry(effect.section, effect.id);
    if (!logEntry) {
      return (
        <Text>
          Unknown campaign log { effect.section }.
        </Text>
      );
    }
    switch (logEntry.type) {
      case 'text': {
        if (effect.cross_out) {
          const text = (effect.section === 'campaign_notes') ?
            t`In your Campaign Log, cross out <i>${logEntry.text}</i>` :
            t`In your Campaign Log, under "${logEntry.section}", cross out <i>${logEntry.text}</i>`;
          return (
            <CampaignGuideTextComponent text={text} />
          );
        }
        const text = (effect.section === 'campaign_notes') ?
          t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
          t`In your Campaign Log, under "${logEntry.section}", record <i>${logEntry.text}</i>.`;
        return (
          <CampaignGuideTextComponent text={text} />
        );
      }
      case 'card': {
        return (
          <CardEffectContent code={logEntry.code} section={logEntry.section} />
        );
      }
      case 'section_count': {
        // Not possible as a record
        return null;
      }
      case 'supplies': {
        // Not possible as a record?
        return null;
      }
    }
  }

  // No id, just a section / count
  const logSection = campaignGuide.logSection(effect.section);
  if (!logSection) {
    return (
      <Text>
        Unknown campaign log section { effect.section }.
      </Text>
    );
  }
  return <Text>Campaign Log Section: { logSection.section }</Text>;
}

export default function CampaignLogEffectComponent({
  effect,
  input,
  bulletType,
}: Props) {
  if (effect.section === 'hidden') {
    return null;
  }
  return (
    <SetupStepWrapper bulletType={bulletType}>
      <CampaignLogEffectsContent effect={effect} input={input} />
    </SetupStepWrapper>
  );
}
