export class YMapsSearchProvider {
  points: { coords: number[]; text: string }[];

  constructor(points: { coords: number[]; text: string }[]) {
    this.points = points;
  }

  // method required by Yandex Maps Search Provider
  geocode(request: string, options: any) {
    const deferred = new ymaps.vow.defer();
    const { resultsEnd, resultsStart, geoObjects } = this.searchPointsResult(
      options,
      request
    );

    deferred.resolve({
      geoObjects,
      metaData: {
        geocoder: {
          request,
          found: geoObjects.getLength(),
          skip: resultsStart,
          results: resultsEnd,
        },
      },
    });
    return deferred.promise();
  }

  private searchPointsResult(options: any, inputText: string) {
    const foundSearchPoints: any[] = [];

    // Check if data contains point(s) for input text
    this.points.forEach((searchPoint) => {
      if (
        searchPoint.text.toLowerCase().indexOf(inputText.toLowerCase()) !== -1
      ) {
        foundSearchPoints.push(searchPoint);
      }
    });

    const { resultsStart, resultsEnd, geoObjects } = this.constructGeoObjects(
      options,
      foundSearchPoints
    );
    return { resultsEnd, resultsStart, geoObjects };
  }

  /**
   * Constructs GeoObjects for search points
   */
  private constructGeoObjects(
    options: { skip: number; results: number },
    foundSearchPoints: any[]
  ) {
    const resultsStart = options.skip || 0;
    const resultsEnd = options.results || 20;
    const geoObjects = new ymaps.GeoObjectCollection();

    foundSearchPoints = foundSearchPoints.splice(resultsStart, resultsEnd);

    foundSearchPoints.forEach((point) => {
      const coords = point.coords;
      const text = point.text;

      // Construct data for search dropdown (found points) and ballon
      geoObjects.add(
        new ymaps.Placemark(coords, {
          name: text + ' name',
          description: text + ' description',
          balloonContentBody: '<p>' + text + '</p>',
          boundedBy: [coords, coords],
        })
      );
    });

    return { resultsStart, resultsEnd, geoObjects };
  }
}
