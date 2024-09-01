import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/service/character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html', 
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];
  species: any[] = [];
  starships: any[] = [];
  vehicles: any[] = [];
  films: any[] = [];
  selectedSpecies: string = '';
  selectedStarship: string = '';
  selectedVehicle: string = '';
  selectedBirthYear: string = 'ALL';
  selectedFilm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  birthYears: string[] = [];
  speciesMap: { [url: string]: string } = {};

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.characterService.getCharacters(this.currentPage).subscribe(data => this.handleCharacters(data));
    this.characterService.getSpecies().subscribe(data => this.handleSpecies(data));
    this.characterService.getStarships().subscribe(data => this.starships = data.results);
    this.characterService.getVehicles().subscribe(data => this.vehicles = data.results);
    this.characterService.getFilms().subscribe(data => this.films = data.results);
  }

  handleCharacters(data: any): void {
    this.characters = data.results;
    this.filteredCharacters = this.characters;
    this.totalPages = Math.ceil(data.count / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateBirthYears();
  }

  handleSpecies(data: any): void {
    this.species = data.results;
    this.speciesMap = this.species.reduce((map, s) => ({ ...map, [s.url]: s.name }), {});
  }

  updateBirthYears(): void {
    this.birthYears = ['ALL', ...new Set(this.characters.map(c => c.birth_year).filter(year => year !== 'unknown'))];
  }

  applyFilters(): void {
    this.filteredCharacters = this.characters.filter(character =>
      (!this.selectedSpecies || character.species.includes(this.selectedSpecies)) &&
      (!this.selectedStarship || character.starships.includes(this.selectedStarship)) &&
      (!this.selectedVehicle || character.vehicles.includes(this.selectedVehicle)) &&
      (this.selectedBirthYear === 'ALL' || character.birth_year === this.selectedBirthYear) &&
      (!this.selectedFilm || (character.films as string[]).some(film => film.includes(this.selectedFilm)))
    );
    this.currentPage = 1;
    this.paginateData();
  }

  paginateData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredCharacters = this.filteredCharacters.slice(start, end);
  }

  getSpeciesNames(speciesUrls: string[]): string {
    return speciesUrls.map(url => this.speciesMap[url] || 'Unknown').join(', ');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  getCharacterIdFromUrl(url: string): number {
    return Number(url.split('/').filter(Boolean).pop());
  }
}
