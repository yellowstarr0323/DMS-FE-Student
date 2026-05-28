/* useAsyncData — 마운트 시(그리고 reload 호출 시) 비동기 fetcher 를 실행하고
   { data, loading, error, reload } 를 노출한다. 신청 후 최신 상태 갱신 등에 쓴다. */

import { useState, useEffect, useCallback } from "react";

export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return fetcher()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
