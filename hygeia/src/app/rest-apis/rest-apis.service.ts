import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestApisService {

  private URL = 'http://localhost:4200/api/';
  private endpoints = {
    'batch': 'batches',
    'state': 'state',
    'block': 'blocks'
  };

  constructor() { }

  public Block(type = 'GET', queryString?: string, blockId?: string): Promise<any> {
    // Creates the end point URL
    let apiURL = this.URL + this.endpoints['block'];

    // Adds the blockId if present
    apiURL = apiURL + (blockId ? ('/' + blockId) : '');

    // Adds the query parameters if present
    apiURL = apiURL + (queryString ? ('?' + queryString) : '');

    // Makes rest api call
    return window.fetch(apiURL);
  }

}
