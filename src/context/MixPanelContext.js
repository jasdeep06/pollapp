import {Mixpanel} from 'mixpanel-react-native';
import React from 'react';

export const MixpanelContext = React.createContext();

export const MixpanelProvider = ({children}) => {
  const [mixpanel, setMixpanel] = React.useState(null);

  React.useEffect(() => {
    
    const trackAutomaticEvents = true;
    const mixpanelInstance = new Mixpanel(`6aa80e01c1b312a931b4205f81da82d7`, trackAutomaticEvents);
    mixpanelInstance.init();
    setMixpanel(mixpanelInstance)

  }, []);

  return <MixpanelContext.Provider value={mixpanel}>{children}</MixpanelContext.Provider>;
};