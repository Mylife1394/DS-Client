import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dlg',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './delete-confirm-dlg.component.html',
  styleUrl: './delete-confirm-dlg.component.css'
})
export class DeleteConfirmDlgComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmDlgComponent>) {}
}
