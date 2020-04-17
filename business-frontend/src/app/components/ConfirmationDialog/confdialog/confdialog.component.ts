import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

export interface ConfirmationDialogText{
  top: string;
  bottom: string;
}

@Component({
  selector: 'app-confdialog',
  templateUrl: './confdialog.component.html',
  styleUrls: ['./confdialog.component.css']
})
export class ConfdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogText
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
