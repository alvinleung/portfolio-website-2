function useGoogleAnalyticsEvent(eventName: string, defaultParam = {}) {
  return function (param) {
    if (typeof window !== 'undefined') {
      if (typeof window.ga === 'function')
        window.ga('send', eventName, { ...defaultParam, ...param });
    }
  };
}

export default useGoogleAnalyticsEvent;
