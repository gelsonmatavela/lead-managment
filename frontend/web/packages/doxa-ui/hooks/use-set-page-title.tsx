import { AppContext } from '@/src/utils/contexts/app.context';
import { useContext, useEffect } from 'react';

export function useSetPageTitle(title: string, condition?: boolean) {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    if (condition === undefined || condition) {
      dispatch({ type: 'set-page-title', payload: { title } });
    }
  }, [title, condition, dispatch]);
}

// Alternative version with callback for conditional logic
export function useSetPageTitleConditional(
  titleOrCallback: string | (() => string | null),
  dependencies: any[] = []
) {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const title = typeof titleOrCallback === 'function' ? titleOrCallback() : titleOrCallback;

    if (title) {
      dispatch({ type: 'set-page-title', payload: { title } });
    }
  }, [titleOrCallback, dispatch, ...dependencies]);
}
