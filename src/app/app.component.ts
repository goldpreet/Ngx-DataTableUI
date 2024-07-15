import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PersonService } from './Services/person.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxDatatableModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  personService = inject(PersonService);
  Math = Math;
  title = 'NgxDatatable';
  rows: any[] = [];
  filteredRows: any[] = [];
  columns = [
    { prop: 'firstName', name: 'First Name' },
    { prop: 'lastName', name: 'Last Name' },
    { prop: 'age', name: 'Age' },
    { prop: 'email', name: 'Email' }
  ];
 
  currentPage: number = 1;
  totalPages: number = 1;
  page = { limit: 3, offset: 0 };

  ngOnInit() {
    this.personService.getUsersData().subscribe((data: any) => {
      console.log(data, "data users");
      this.rows = data.map((user: any) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email
      }));
      this.filteredRows = [...this.rows];
      this.initializePagination();
    });
  }

  getMaxEntries(): number {
    return Math.min((this.page.offset + 1) * this.page.limit, this.filteredRows.length);
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredRows = this.rows.filter(row => {
      return row.firstName.toLowerCase().includes(val) || 
             row.lastName.toLowerCase().includes(val) || 
             row.email.toLowerCase().includes(val) || 
             !val;
    });
    this.initializePagination();
  }

  onPage(event: any) {
    this.page = event;
    this.currentPage = this.page.offset + 1;
  }

  onFirstPage(): void {
    this.page.offset = 0;
    this.updateTable();
  }

  onPreviousPage(): void {
    if (this.page.offset > 0) {
      this.page.offset--;
      this.updateTable();
    }
  }

  onNextPage(): void {
    if (!this.isLastPage()) {
      this.page.offset++;
      this.updateTable();
    }
  }

  onLastPage(): void {
    this.page.offset = this.totalPages - 1;
    this.updateTable();
  }

  onPageSelect(pageNum: number): void {
    this.page.offset = pageNum - 1;
    this.updateTable();
  }

  isLastPage(): boolean {
    return this.page.offset === this.totalPages - 1;
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  onItemsPerPageChange(event: Event): void {
    const newLimit = parseInt((event.target as HTMLSelectElement).value, 10);
    this.page.limit = newLimit;
    this.initializePagination();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredRows.length / this.page.limit);
  }

  initializePagination(): void {
    this.updateTotalPages();
    this.page.offset = 0;
    this.currentPage = 1;
    this.updateTable();
  }

  updateTable(): void {
    this.currentPage = this.page.offset + 1;
    // Force the table to update
    this.filteredRows = [...this.filteredRows];
  }
}