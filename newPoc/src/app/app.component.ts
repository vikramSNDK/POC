import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { StudentServiceService } from './student-service.service';
import { ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  PaginationModule,
  ModuleRegistry,
  RowApiModule,
  QuickFilterModule,
  RowNodeTransaction,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  EventApiModule,
  CellStyleModule,
  AllCommunityModule,
  createGrid, } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { AdvancedFilterModule } from 'ag-grid-enterprise';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { NumberEditorModule } from 'ag-grid-community';
import { TextEditorModule } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextEditorModule,
  NumberEditorModule,
  RowSelectionModule,
  PaginationModule,
  RowApiModule,
  QuickFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  EventApiModule,
  // AdvancedFilterModule,
  ValidationModule,
]);

@Component({
  selector: 'app-root',
  imports: [AgGridAngular,RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private gridApi!: GridApi;

  public pageNo=0;
  public pageSize=0;

  paginationPageSize=10;

  paginationPageSizeSelector=[5,10,20,50,100];

  defaultColDef: ColDef={
    flex:1,
    editable:true,
    cellStyle: { textAlign:'center'},
    // headerClass: 'center-header'
  };

  colDefs: ColDef[] = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true, 
        maxWidth: 50,
        minWidth: 50,
      },
      { headerName:"Roll no.", field: "Roll_no", editable:false, minWidth: 100 },
      { headerName:"Name", field: "Name", editable:true, minWidth:150 },
      { headerName:"Age", field: "Age", editable:true, minWidth: 100 },
      { headerName:"Year", field: "Year", editable:true, minWidth: 100 },
      {
        field:"edit",
        headerName:"Action",
        cellRenderer: EditButtonComponent,
        minWidth: 150
      },
  ];

  rowData: any[]=[]

  constructor(private studentService: StudentServiceService){}

  ngOnInit(){
    this.loadStudents();
  }

  public loadStudents(){
    this.studentService.getAllStudents().subscribe(data => {
      this.rowData=data;
    })
  }

  onApplyingFilter(){
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  onDelete(){
    const selectedData=this.gridApi.getSelectedRows();
    const res=this.gridApi.applyTransaction({ remove: selectedData });
    this.studentService.deleteStudents(selectedData).subscribe(response =>{
      console.log(response);
      this.loadStudents();
    })
  }

  onGridReady(params: GridReadyEvent){
    this.gridApi=params.api;

    this.gridApi.addEventListener('paginationChanged', () => {
      this.pageSize=this.gridApi.paginationGetPageSize();
      this.pageNo=this.gridApi.paginationGetCurrentPage();
      console.log(`Current page is: ${this.pageNo} and current page size is: ${this.pageSize}`);
      // this.loadStudents(this.pageNo, this.pageSize);
    });
    // this.loadStudents();
  }

  newRow = {
    Roll_no:0,
    Name: '',
    Age: null,
    Year: null
  };

  onAdd() {
    if (this.newRow.Name && this.newRow.Age && this.newRow.Year) {
      const newRowData = {
        Roll_no: this.newRow.Roll_no,
        Name: this.newRow.Name,
        Age: this.newRow.Age,
        Year: this.newRow.Year
      };
  
      this.rowData = [...this.rowData, newRowData];
      console.log("NewRow data is: ", newRowData);
  
      this.studentService.createStudent(newRowData).subscribe(
        response => {
          console.log("Student created successfully:", response);
          this.loadStudents();
          this.resetNewRow();
        },
        error => {
          console.error(newRowData);
          console.error('Error Creating student', error);
        }
      );
    } else {
      alert('Please fill in all fields');
    }
  }
  

  resetNewRow(){
    this.newRow={
      Roll_no:0,
      Name: '',
      Age: null,
      Year: null
    };
  }

  public rowSelection: 'single' | 'multiple' = 'multiple';

}
