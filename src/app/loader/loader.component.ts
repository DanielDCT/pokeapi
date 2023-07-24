import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Deshabilitar el scroll del body cuando se muestra el LoaderComponent
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Habilitar el scroll del body cuando se oculta el LoaderComponent
    document.body.style.overflow = 'auto';
  }
}
