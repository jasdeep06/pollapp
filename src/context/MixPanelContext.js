import {Mixpanel} from 'mixpanel-react-native';
import React from 'react';

export const MixpanelContext = React.createContext();

export const MixpanelProvider = ({children}) => {
  const [mixpanel, setMixpanel] = React.useState(null);

  React.useEffect(() => {
    const initMixpanel = async () => {
      const initializedMixpanel = await Mixpanel.init('your token');
      initializedMixpanel.serverURL = 'https://api-eu.mixpanel.com'; // if needed
      setMixpanel(initializedMixpanel);
    };

    initMixpanel();
  }, []);

  return <MixpanelContext.Provider value={mixpanel}>{children}</MixpanelContext.Provider>;
};