import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductServiceDatabase } from '../../../service/product.service';

@Component({
    templateUrl: './product.component.html',
    providers: [MessageService]
})
export class ProductComponent implements OnInit, OnDestroy {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    productSubscribe: Product;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    categoria: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductServiceDatabase, private messageService: MessageService) { }

    ngOnInit() {

        this.productService.getProducts().subscribe(data => {
            this.products = data;
        });

        this.cols = [
            { field: 'nome', header: 'Nome' },
            { field: 'preco', header: 'Preço' },
            { field: 'categoria', header: 'Categoria' }
        ];

        this.categoria = [
            { label: 'NAPOLITANA', value: 'napolitana' },
            { label: 'ROMANA', value: 'romana' },
            { label: 'FRITA', value: 'frita' },
            { label: 'AL TRANCIO', value: 'al trancio' },
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    

    deleteSelectedProducrs() {
        console.log(this.selectedProducts)
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
        console.log("Deletando " + this.product.key);
    }


    confirmDeleteSelected() {
        console.log("confirmDeleteSelected");
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        for(let i = 0; i < this.selectedProducts.length; i++){
            const key = this.selectedProducts[i].key;
            this.productService.deleteProduct(key);
        }
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        console.log(this.products)
        this.selectedProducts = [];
    }

    confirmDelete() {
        console.log("confirmDelete")
        this.productService.deleteProduct(this.product.key);
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.key !== this.product.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
        console.log(this.products)
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.nome?.trim()) {
            if (this.product.id) {
                console.log("alterado")
                // @ts-ignore
                this.product.categoria = this.product.categoria.value ? this.product.categoria.value : this.product.categoria;
                this.productService.updateProduct(this.product.key, this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                console.log("inserido")
                this.product.id = this.createId();
                this.productService.createProduct(this.product);
                // @ts-ignore
                this.product.sexo = this.product.sexo ? this.product.sexo.value : 'OUTRO';
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].key === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    ngOnDestroy(){
        this.products = []
        this.selectedProducts = []
    }
}
