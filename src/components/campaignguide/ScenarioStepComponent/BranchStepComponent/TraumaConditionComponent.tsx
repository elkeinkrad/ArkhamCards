import React, { useMemo } from 'react';
import { t } from 'ttag';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  KilledTraumaCondition,
} from '@data/scenario/types';
import { killedTraumaConditionResult } from '@data/scenario/conditionHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: KilledTraumaCondition;
  campaignLog: GuidedCampaignLog;
}


export default function TraumaConditionComponent({ step, condition, campaignLog }: Props) {
  const prompt = useMemo((): string => {
    const messages = {
      killed: {
        lead_investigator: t`If the lead investigator was <b>killed</b>.`,
        all: t`If all investigators were <b>killed</b>.`,
      },
    };
    return messages[condition.trauma][condition.investigator];
  }, [condition]);

  const result = killedTraumaConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={prompt}
      result={result.decision}
    />
  );
}
