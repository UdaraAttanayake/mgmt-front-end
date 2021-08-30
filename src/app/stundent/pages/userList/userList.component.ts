import { Observable, Subscription } from "rxjs";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";

import { Student } from "../../../core/models/Student";
import { map } from "rxjs/operators";
import { EditService } from "../../../core/services/edit.service";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { DataService } from "../../../core/services/data.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NotificationService } from "@progress/kendo-angular-notification";
import * as moment from "moment";

@Component({
    selector: "my-app",
    templateUrl: "./userList.component.html",
    styleUrls: ["./userList.component.scss"],
})
export class userListComponent implements OnInit {
    private query: any;

    public myForm: FormGroup | undefined;
    fileInputLabel: string | undefined;

    public students: Student[] = [];

    public value: Date = new Date(2000, 2, 10);
    public view!: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10,
    };

    private editService: EditService;
    private editedRowIndex: number | undefined;
    private editedProduct: Student | undefined;

    myRestrictions: FileRestrictions = {
        allowedExtensions: [".xls", ".xlsx"],
    };
    uploadedFiles: any;
    studentData: any;

    constructor(
        @Inject(EditService) editServiceFactory: any,
        private dataService: DataService,
        public http: HttpClient,
        private notificationSrvice: NotificationService
    ) {
        this.editService = editServiceFactory();
    }

    public ngOnInit() {
        // this.view = this.editService.pipe(map(data => process(data, this.gridState)));
        // this.editService.read();
        console.log(this.view);
        this.query = this.dataService
            .getAllStudents()
            .valueChanges.subscribe((result: any) => {
                result.data.getAllStudents.map((_student: any) => {
                    let date = moment(_student.dob).utc().format("MM/DD/YYYY");
                    let __std: Student = {
                        id: _student.id,
                        name: _student.name,
                        dob: date,
                        age: _student.age,
                        email: _student.email,
                    };
                    this.students.push(__std);
                });
                // this.studentData = this.students.map((data: any) => process(data, this.gridState));

                console.log(this.studentData, this.students);
            });
        console.log(this.students);
        console.log(this.studentData);
    }
    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    public addHandler({ sender }: any, formInstance: any) {
        formInstance.reset();
        this.closeEditor(sender);
        this.myForm = new FormGroup({
            name: new FormControl(),
            dob: new FormControl(),
            age: new FormControl(),
            email: new FormControl(),
        });
        sender.addRow(this.myForm);

        // sender.addRow(new Product());
    }

    public editHandler({ sender, rowIndex, dataItem }: any) {
        this.myForm = new FormGroup({
            userName: new FormControl(dataItem.userName),
            dob: new FormControl(dataItem.dob),
            age: new FormControl(dataItem.age),
            email: new FormControl(dataItem.email),
        });
        console.log("myForm", this.myForm);

        this.closeEditor(sender);

        this.editedRowIndex = rowIndex;
        this.editedProduct = Object.assign({}, dataItem);

        sender.editRow(rowIndex, this.myForm);

        // sender.editRow(rowIndex);
    }

    public cancelHandler({ sender, rowIndex }: any) {
        this.closeEditor(sender, rowIndex);
    }

    public saveHandler({ sender, rowIndex, dataItem, isNew }: any) {
        // this.editService.save(dataItem, isNew);
        let data = { ...dataItem, age: Number(dataItem.age) };
        this.dataService.updateStudent(data);

        sender.closeRow(rowIndex);

        this.editedRowIndex = undefined;
        this.editedProduct = undefined;
    }

    public async removeHandler({ dataItem }: any) {
        this.editService.remove(dataItem);
        let _result;
        _result = await this.dataService.deleteStudent(dataItem);
    }

    private closeEditor(grid: any, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editService.resetItem(this.editedProduct);
        this.editedRowIndex = undefined;
        this.editedProduct = undefined;
    }

    fileChange(element: any) {
        this.uploadedFiles = element.target.files;
        console.log(this.uploadedFiles);
    }

    uploadSelected() {
        this.dataService.uploadSelected(this.uploadedFiles[0]);
    }
}
