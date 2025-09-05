import React, { createContext } from 'react';

export const AppContext = createContext<{ state: any; dispatch: any }>({
    state: {},
    dispatch: () => { },
});
