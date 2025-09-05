function appReducer(state: { sessionExpired: boolean; pageTitle: string }, action: any) {
  switch (action.type) {
    case 'session-expired': {
      return { ...state, sessionExpired: true };
    }
    case 'session-renewed': {
      return { ...state, sessionExpired: false };
    }
    case 'set-page-title': {
      return { ...state, pageTitle: action.payload.title };
    }
  }
}

export default appReducer;
