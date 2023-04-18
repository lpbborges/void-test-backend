const routes = {
  americas: ['na1', 'br1', 'la1', 'la2'],
  asia: ['kr', 'jp'],
  europe: ['eun1', 'euw1', 'tr1', 'ru'],
  sea: ['oc1', 'ph2', 'sg2', 'th2', 'tw2', 'vn2'],
};

export function parsePlatformToRegionalRoutings(region: string) {
  for (const route in routes) {
    if (routes[route].includes(region)) {
      return route;
    }
  }
}
