import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { GoHomeComponent } from "../goHome/goHome";
import { Product } from "../../interfaces/product.interface";
import { CommonModule } from "@angular/common";

@Component({
  selector: "searchProducts-component",
  standalone: true,
  templateUrl: "./searchProducts.component.html",
  styleUrls: ["./searchProducts.components.css"],
  imports: [GoHomeComponent, CommonModule],
})
export class SearchProductsComponent implements OnInit {

  // 🔹 LISTAS
  allProducts: Product[] = [];      // Lista original completa
  products: Product[] = [];         // Lista visible en la tabla

  // 🔹 BÚSQUEDA
  searchTerm: string = "";

  // 🔹 SELECT DE CANTIDAD DE REGISTROS
  recordsLimit: number = 5;
  limits = [5, 10, 20];

  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // 📌 CARGAR DATOS DESDE BACKEND
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (resp) => {
        this.allProducts = resp.data || [];
        this.applyLimit(); // mostrar según límite inicial
        this.cd.detectChanges();
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  // 🔍 BÚSQUEDA (invocado desde el input con template ref)
  onSearch(term: string): void {
    this.searchTerm = (term || "").toLowerCase().trim();
    this.applyLimit();   // Se vuelve a aplicar el límite al filtrar
  }

  // 🔢 CUANDO EL SELECT CAMBIA
  onLimitChange(value: string | number): void {
    const v = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!isNaN(v) && this.recordsLimit !== v) {
      this.recordsLimit = v;
      this.applyLimit();
      // detectChanges si quieres forzar (ya en applyLimit se llama)
    }
  }

  // 🔢 APLICAR LÍMITE DE REGISTROS
  applyLimit(): void {

    let filtered = [...this.allProducts];

    // Aplicar filtro si existe búsqueda
    if (this.searchTerm !== "") {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm) ||
        p.description.toLowerCase().includes(this.searchTerm) ||
        p.id.toLowerCase().includes(this.searchTerm)
      );
    }

    // Cortar según límite seleccionado
    this.products = filtered.slice(0, this.recordsLimit);
    this.cd.detectChanges();
  }

}
