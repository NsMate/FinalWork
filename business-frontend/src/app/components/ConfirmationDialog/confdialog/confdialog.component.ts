import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-confdialog',
  templateUrl: './confdialog.component.html',
  styleUrls: ['./confdialog.component.css']
})
export class ConfdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfdialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}