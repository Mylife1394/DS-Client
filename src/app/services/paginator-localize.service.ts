import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginatorLocalizeService {

  constructor() { }

  private getRangeLabelIntl(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return 0 + " از " + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + " - " + endIndex + " از " + length;
  }

  public localize(paginator:MatPaginator) {
    paginator._intl.itemsPerPageLabel = "تعداد سطر ها در هر صفحه";
    paginator._intl.getRangeLabel = this.getRangeLabelIntl;
  }
}
