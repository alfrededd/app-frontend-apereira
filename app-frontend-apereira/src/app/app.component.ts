import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPageComponent } from "./pages/header/header.page.component";
import { FooterPageComponent } from "./pages/footer/footer.page.component";
import { ContentComponent } from "./pages/Content/content.page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderPageComponent, FooterPageComponent, ContentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Mi Aplicacion del Banco');
}
