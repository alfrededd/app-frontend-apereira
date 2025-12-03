import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoHomeComponent } from "../goHome/goHome";
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'addForm-component',
  standalone: true,
  templateUrl:'./addForm.component.html',
  styleUrls:['./addForm.component.css'],
  imports: [GoHomeComponent, ReactiveFormsModule, CommonModule]
})
export class AddFormComponent implements OnInit {

  form!: FormGroup;
  today = new Date().toISOString().split("T")[0];

  editing: boolean = false;
  currentId: string = "";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("ID recibido:", this.currentId);

  console.log("Modo edición:", this.editing);

    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.validateExistingId.bind(this)]
      ],

      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.validateReleaseDate]],
      date_revision: ['', [Validators.required, this.validateReviewDate.bind(this)]]
    });

    // ⭐ Detectar si es edición
    this.currentId = this.route.snapshot.paramMap.get('id') ?? "";
    this.editing = this.currentId !== "";

    if (this.editing) {
      this.loadProductToForm();
      this.form.get('id')?.disable(); // ID readonly
    }
  }

  // ============================
  // ⭐ Cargar datos para editar
  // ============================
  loadProductToForm() {
    this.productService.getProductById(this.currentId).subscribe({
      next: (resp: any) => {
    console.log("RESPUESTA DE GET PRODUCT:", resp);

        const p = resp;

        this.form.patchValue({
          id: p.id,
          name: p.name,
          description: p.description,
          logo: p.logo,
          date_release: p.date_release.substring(0, 10),
          date_revision: p.date_revision.substring(0, 10)
        });
      },
      error: (err) => {
        alert("Error cargando producto");
        console.error(err);
      }
    });
  }

  // VALIDACIÓN ASYNC ID
  validateExistingId(control: AbstractControl) {
    if (this.editing) return null; // en edición no validar ID repetido

    return this.productService.getProductById(control.value).pipe(
      map((resp: any) => resp.data ? { idExists: true } : null)
    );
  }

  // FECHA >= HOY
  validateReleaseDate(control: AbstractControl) {
    if (!control.value) return null;
    const c = new Date(control.value);
    const t = new Date();
    t.setHours(0,0,0,0);
    return c >= t ? null : { invalidRelease: true };
  }

  // REVISIÓN = +1 AÑO
  validateReviewDate(control: AbstractControl) {
    if (!control.value || !this.form) return null;

    const release = new Date(this.form.get('date_release')?.value);
    const revision = new Date(control.value);

    const oneYearLater = new Date(release);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    return revision.getTime() === oneYearLater.getTime()
      ? null
      : { invalidReview: true };
  }

  // RESET
  onReset(): void {
    this.form.reset();
  }

  // ============================
  // ⭐ GUARDAR (AGREGAR O EDITAR)
  // ============================
  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = this.form.getRawValue(); // incluye ID deshabilitado

    // AGREGAR
    if (!this.editing) {
      this.productService.addProduct(body).subscribe({
        next: () => {
          alert("Producto agregado");
          this.router.navigate(['/searchProductsAdd']);
        },
        error: (err) => alert("Error al agregar")
      });
      return;
    }

    // EDITAR
    this.productService.updateProduct(this.currentId, body).subscribe({
      next: () => {
        alert("Producto actualizado");
        this.router.navigate(['/searchProductsAdd']);
      },
      error: () => alert("Error al actualizar")
    });

  }


}
