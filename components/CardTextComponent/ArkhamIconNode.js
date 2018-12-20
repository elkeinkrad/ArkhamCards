import React from 'react';

import ArkhamIcon from '../../assets/ArkhamIcon';

const BAD_ICON_NAMES = {
  Action: 'action',
  'per investigator': 'per_investigator',
  lightning: 'free',
  lighting: 'free',
  fast: 'free',
  'lightning" title="Fast Action': 'free',
  'tablet" title="Tablet': 'tablet',
  'cultist" title="Cultist': 'cultist',
  'intellect" title="Intellect': 'cultist',
  'action" title="Action': 'cultist',
  'auto-fail': 'auto_fail',
};

export default function ArkhamIconNode(node, output, state) {
  return (
    <ArkhamIcon
      key={state.key}
      name={BAD_ICON_NAMES[node.name] || node.name}
      size={16}
      color="#000000"
    />
  );
}
