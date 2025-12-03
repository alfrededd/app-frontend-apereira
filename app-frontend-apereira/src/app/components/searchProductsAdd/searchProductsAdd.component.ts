import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { GoHomeComponent } from "../goHome/goHome";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'searchProductsAdd-component',
  standalone: true,
  templateUrl: './searchProductsAdd.component.html',
  styleUrls: ['./searchProductsAdd.component.css'],
  imports: [GoHomeComponent, CommonModule]
})
export class SearchProductsAddComponent implements OnInit {

  // LISTAS
  allProducts: Product[] = [];
  products: Product[] = [];

  // BÚSQUEDA
  searchTerm: string = "";

  // SELECT LÍMITE
  recordsLimit: number = 5;
  limits = [5, 10, 20];

  openMenuIndex: number | null = null;

  // Modal de confirmación
  showConfirmModal: boolean = false;
  confirmMessage: string = "";
  confirmAction: () => void = () => { };

  constructor(
    private router: Router,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  goForm() {
    this.router.navigate(['/addProduct']);
  }

  goEdit(product: Product) {
    this.router.navigate(['/addProduct', product.id]);
  }

  // Cargar productos
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (resp) => {
        this.allProducts = resp.data;
        this.applyLimit();
        this.cd.detectChanges();
      },
      error: (err) => console.error("Error cargando productos:", err)
    });
  }

  // Manejar búsqueda
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    this.applyLimit();
  }

  // Aplicar límite + filtro
  applyLimit(): void {
    let filtered = [...this.allProducts];

    if (this.searchTerm !== "") {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm) ||
        p.description.toLowerCase().includes(this.searchTerm) ||
        p.id.toLowerCase().includes(this.searchTerm)
      );
    }

    this.products = filtered.slice(0, this.recordsLimit);
    this.cd.detectChanges();
  }

  // Cambiar el límite desde el select
  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recordsLimit = Number(select.value);
    this.applyLimit();
  }

  // ================================
  // ⋮ MENÚ POR FILA
  // ================================
  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  closeMenus() {
    this.openMenuIndex = null;
  }

  // ================================
  // 🗑 CONFIRMACIÓN
  // ================================
  openConfirm(message: string, action: () => void) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirmModal = true;
    this.openMenuIndex = null;
  }

  confirmDelete(product: Product): void {
    const message = `¿Está seguro que quiere eliminar el producto "${product.name}"?`;

    this.openConfirm(message, () => {
      this.deleteProduct(product);
    });
  }

  cancelConfirm() {
    this.showConfirmModal = false;
  }

  confirm() {
    this.showConfirmModal = false;
    this.confirmAction();
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id).subscribe({
      next: (resp: any) => {
        alert("Producto eliminado correctamente");
        this.allProducts = this.allProducts.filter(p => p.id !== product.id);
        this.applyLimit(); // refrescar tabla
      },
      error: (err) => {
        console.error("Error eliminando:", err);
        alert("No se pudo eliminar el producto");
      }
    });
  }

}
