import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  constructor() { } // Constructor del componente

  ngOnInit(): void { } // Implementación del método ngOnInit del ciclo de vida del componente

  @Input() listPokemons: any[] = []; // Propiedad de entrada que recibirá la lista de pokémones desde el componente padre
}
