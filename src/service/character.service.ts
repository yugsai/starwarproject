import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}


  getData(url: string): Observable<any> {
    return this.http.get(url);
  }


  getCharacters(page: number = 1): Observable<any> {
    return this.getData(`${this.baseUrl}/people/?page=${page}`);
  }


  getCharacterById(id: number): Observable<any> {
    return this.getData(`${this.baseUrl}/people/${id}/`);
  }


  getSpecies(): Observable<any> {
    return this.getData(`${this.baseUrl}/species/`);
  }


  getFilms(): Observable<any> {
    return this.getData(`${this.baseUrl}/films/`);
  }

   
  getStarships(): Observable<any> {
    return this.getData(`${this.baseUrl}/starships/`);
  }

 
  getVehicles(): Observable<any> {
    return this.getData(`${this.baseUrl}/vehicles/`);
  }
}
