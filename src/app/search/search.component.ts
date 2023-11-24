import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm = new FormControl(); // Declara un FormControl para gestionar el campo de búsqueda.
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter para emitir eventos al componente padre con el término de búsqueda.
  filteredPokemons: string[] = []; // Almacena los Pokémon filtrados.
  originalPokemons: string[] = []; // Lista original de todos los Pokémon.
  isLoading: boolean = false; // Variable para rastrear si se están cargando datos.

  constructor(private http: HttpClient) {
    // Suscribe el FormControl `searchTerm` a cambios de valor y realiza acciones según los cambios.
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(300), // Emite un valor solo después de un intervalo de 300ms desde la última emisión.
        distinctUntilChanged() // Emite un valor solo si es distinto al valor anterior.
      )
      .subscribe(term => {
        this.filterPokemons(term); // Llama a la función `filterPokemons` al cambiar el término de búsqueda.
      });

    // Cargar la lista original de Pokémon al inicializar el componente.
    this.loadOriginalPokemons();
  }

  // Método para cargar la lista original de Pokémon desde una API.
  loadOriginalPokemons() {
    this.isLoading = true; // Activa el indicador de carga.
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=1000').subscribe(
      (data: any) => {
        this.originalPokemons = data.results.map((pokemon: any) => pokemon.name); // Almacena los nombres de los Pokémon.
        this.filteredPokemons = this.originalPokemons; // Al inicio, muestra todos los Pokémon.
        this.isLoading = true; // Desactiva el indicador de carga después de cargar los datos.
      },
      (error: any) => {
        console.error('Error fetching Pokémon:', error); // Muestra un mensaje de error en la consola si hay un problema al cargar los datos.
        this.isLoading = false; // Desactiva el indicador de carga si hay un error.
      }
    );
  }

  // Filtra los Pokémon según el término de búsqueda.
  filterPokemons(value: string) {
    if (value && value.trim().length >= 3) {
      this.filteredPokemons = this.originalPokemons.filter(
        pokemon => pokemon.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      // Si el campo de búsqueda está vacío o tiene menos de 3 caracteres, mostrar todos los Pokémon.
      this.filteredPokemons = this.originalPokemons;
      if (!value) {
        this.showAllPokemons(); // Llama a la función `showAllPokemons` si el término de búsqueda está vacío.
      }
    }
  }

  // Emite un evento al componente padre para mostrar todos los Pokémon.
  showAllPokemons() {
    this.searchChanged.emit('');
  }

  // Se activa cuando se selecciona un Pokémon de la lista desplegable.
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedPokemon = event.option.viewValue as string;
    this.searchChanged.emit(selectedPokemon); // Emite el nombre del Pokémon seleccionado al componente padre.
  }

  // Realiza la búsqueda de Pokémon según el término ingresado en el campo de búsqueda.
  performSearch() {
    const value = this.searchTerm.value;
    if (value && value.trim().length >= 3) {
      this.filterPokemons(value); // Filtra los Pokémon según el término de búsqueda.
      this.searchChanged.emit(value); // Emite el término de búsqueda al componente padre.
    } else {
      if (this.filteredPokemons.length === 0) {
        // Emitir el evento solo si la lista filtrada ya está vacía.
        this.searchChanged.emit('');
      }
      this.filteredPokemons = []; // Reinicia la lista filtrada si el término de búsqueda está vacío.
    }
  }
}