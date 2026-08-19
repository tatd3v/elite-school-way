export function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callback = `eliteCB_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}callback=${callback}`;
    const script = document.createElement('script');
    script.src = fullUrl;

    const cleanup = () => {
      delete window[callback];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, 30000);

    window[callback] = (data) => {
      clearTimeout(timeout);
      resolve(data);
      cleanup();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error('JSONP request failed'));
    };

    document.head.appendChild(script);
  });
}
