import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'menu-component',
  templateUrl:'./menu.component.html',
  styleUrl:'./menu.component.css',
    standalone: true,
   imports: [RouterLink, CommonModule],
})
export class MenuComponent {

}
