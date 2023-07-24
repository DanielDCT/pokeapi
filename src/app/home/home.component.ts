import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private meta:Meta) {
    meta.updateTag({property: 'og:title', content: 'PokeApi | Daniel David Calderón Tinjaca'});
    meta.updateTag({name: 'description', content:'¡Descubre el emocionante mundo de Pokémon! Información detallada sobre variedad de Pokémon, habilidades, movimientos y evoluciones en esta web con API Pokémon. ¡Conviértete en un Maestro Pokémon!'});
    meta.updateTag({name: 'copyright', content:'Copyright - Daniel David Calderón Tinjaca'});
    meta.updateTag({name: 'author', content: 'Daniel David Calderón Tinjaca'});
    meta.updateTag({name: 'robots', content:'index, follow'});
    meta.updateTag({name: 'language', content: 'es'});
  }
}
