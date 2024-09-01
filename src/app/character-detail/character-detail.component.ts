import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/service/character.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html', 
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit {
  character: any;
  films: any[] = [];
  speciesName: string = 'Unknown';
  vehicles: any[] = [];
  starships: any[] = [];
  slug: any;

  constructor(private route: ActivatedRoute, private characterService: CharacterService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['id'];

      if (this.slug) {
        const id = +this.slug;
        this.characterService.getCharacterById(id).subscribe(characterData => {
          this.character = characterData;

          if (this.character) {
            this.loadFilms();
            this.loadSpecies();
            this.loadVehicles();
            this.loadStarships();
          } else {
            console.warn('Character not found');
          }
        }, error => {
          console.error('Error fetching character details:', error);
        });
      } else {
        console.error('Invalid character ID');
      }
    });
  }


  loadFilms(): void {
    this.character.films.forEach((filmUrl: string) => {
      this.characterService.getData(filmUrl).subscribe(filmData => {
        this.films.push(filmData);
      });
    });
  }


  loadSpecies(): void {
    if (this.character.species.length > 0) {
      this.characterService.getData(this.character.species[0]).subscribe(speciesData => {
        this.speciesName = speciesData?.name || 'Unknown';
      });
    }
  }


  loadVehicles(): void {
    this.character.vehicles.forEach((vehicleUrl: string) => {
      this.characterService.getData(vehicleUrl).subscribe(vehicleData => {
        this.vehicles.push(vehicleData);
      });
    });
  }


  loadStarships(): void {
    this.character.starships.forEach((starshipUrl: string) => {
      this.characterService.getData(starshipUrl).subscribe(starshipData => {
        this.starships.push(starshipData);
      });
    });
  }
}
