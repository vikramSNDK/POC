import { Component, EventEmitter, Output } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { StudentServiceService } from '../student-service.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-edit-button',
  imports: [],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.css'
})
export class EditButtonComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  data: any;

  @Output() edit=new EventEmitter();

  // private appCompo: AppComponent

  constructor(private appCompo: AppComponent,private studentService: StudentServiceService){}
  
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params=params;
    this.data=params.node.data;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  editClicked(){
    // console.log(this.data);
    const roll_no=this.data["Roll_no"];
    const toBeUpdatedData=this.data;
    this.studentService.updateStudent(roll_no, toBeUpdatedData).subscribe(response =>{
      // console.log(roll_no);
      // console.log(toBeUpdatedData);
      console.log(response);
      this.studentService.getAllStudents().subscribe(response => {
        console.log(response);
        this.appCompo.ngOnInit();
      })
    })
  }

}
