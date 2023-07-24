import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ViewportScroller } from '@angular/common';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

// Clase personalizada de MatPaginatorIntl
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página:';
}

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class PokemonComponent implements OnInit {
  // Definimos algunas propiedades del componente
  seleccionados: string[] = []; // Lista de Pokémon seleccionados (inicialmente vacía)
  pokemons: any[] = []; // Lista de Pokémon a mostrar en la página (inicialmente vacía)
  pokeStats: any[] = []; // Lista de estadísticas de los Pokémon (inicialmente vacía)
  currentPage: number = 0; // Número de página actual (inicialmente 0)
  pageSize: number = 42; // Tamaño de página, es decir, cantidad de Pokémon a mostrar por página (inicialmente 20)
  totalPokemons: number = 0; // Número total de Pokémon (inicialmente 0)
  isLoading: boolean = false; // Agregar la propiedad isLoading e inicializarla como false

  // Constructor del componente, recibe una instancia de 'ViewportScroller'
  constructor(private viewportScroller: ViewportScroller, private http: HttpClient) { }

  // Método que se ejecuta cuando se inicializa el componente
  ngOnInit(): void {
    this.getTotalPokemons(); // Obtiene el número total de Pokémon
    this.loadPokemons(); // Carga la lista de Pokémon para la página actual
  }

  // Método asincrónico que obtiene el número total de Pokémon utilizando la PokeAPI
  async getTotalPokemons() {
    try {
      // Realiza una petición HTTP GET a la PokeAPI para obtener la lista de Pokémon
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
      // Extrae el número total de Pokémon del resultado de la respuesta
      this.totalPokemons = response.data.count;
    } catch (error) {
      console.error('Error getting total Pokémon count:', error); // Si hay un error, se muestra en la consola
    }
  }

  // Método asincrónico que carga la lista de Pokémon para la página actual
  async loadPokemons() {
    try {
      this.isLoading = true; // Mostrar el LoaderComponent mientras se cargan los Pokémon
      // Calcula el offset para la página actual multiplicando el número de página por el tamaño de página
      const offset = this.currentPage * this.pageSize;
      // Realiza una petición HTTP GET a la PokeAPI para obtener la lista de Pokémon para la página actual
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${this.pageSize}`);
      // Extrae las URL de los Pokémon del resultado de la respuesta
      const pokemonUrls = response.data.results.map((pokemon: { url: string }) => pokemon.url);
      // Limpia los datos previos de las estadísticas de Pokémon
      this.pokeStats = [];
      // Itera sobre las URLs de los Pokémon y realiza una petición HTTP GET para obtener sus estadísticas
      for (const url of pokemonUrls) {
        const pokeResponse = await axios.get(url);
        this.pokeStats.push(pokeResponse.data); // Agrega las estadísticas del Pokémon a la lista de estadísticas
      }
      this.pokemons = this.pokeStats; // Actualiza la lista de Pokémon que se mostrará en la página
    } catch (error) {
      console.error('Error loading Pokémon list:', error); // Si hay un error, se muestra en la consola
    } finally {
      this.isLoading = false; // Ocultar el LoaderComponent después de cargar los Pokémon
    }
  }

  // Método para realizar la búsqueda en la API de Pokémon
  searchPokemon(searchTerm: string) {
    this.isLoading = true;
    this.http.get<any>( // Utilizamos <any> para indicar que los datos de la respuesta no están tipados
      `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
    ).subscribe(
      (response) => {
        this.pokemons = [response]; // Mostrar el resultado de la búsqueda
        this.isLoading = false;
      },
      (error) => {
        console.error('Error searching Pokémon:', error);
        this.isLoading = false;
      }
    );
  }

  // Método que se ejecuta cuando cambia la búsqueda en el componente de búsqueda
  onSearchChanged(searchTerm: string) {
    if (searchTerm.trim() !== '') {
      this.searchPokemon(searchTerm);
    } else {
      this.loadPokemons(); // Si no se ingresa término de búsqueda, cargar la lista de Pokémon normalmente
    }
  }

  // Método que se ejecuta cuando cambia la página en la paginación
  onPageChanged(event: any) {
    this.currentPage = event.pageIndex; // Actualiza el número de página actual
    this.loadPokemons(); // Carga la lista de Pokémon para la nueva página
    this.viewportScroller.scrollToPosition([0, 0]); // Desplaza la vista hacia arriba (arriba de la página)
  }
}