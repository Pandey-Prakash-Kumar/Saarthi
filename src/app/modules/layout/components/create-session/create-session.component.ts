import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { CREATE_SESSION_FORM } from 'src/app/core/constants/formConstant';
import { CanLeave } from '../../../../core/interfaces/canLeave';
import { ApiService } from 'src/app/core/services';
import { FormService } from 'src/app/core/services/form/form.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { DynamicFormComponent } from 'src/app/shared';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ExitPopupComponent } from 'src/app/shared/components/exit-popup/exit-popup.component';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit,CanLeave {
  @ViewChild('createSession') createSession: DynamicFormComponent;
  imgData = {
    type: 'session',
    image: '',
    isUploaded: true
  }
  defaultImageArray = []
  formData: any;
  localImage: any;
  isSaved:any = false;
  uiConfig = {
    appearance: 'fill',
    floatLabel: 'always'
  }
  sessionDetails: any;
  sessionId: any;
  imageChanged:any = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  constructor(private form: FormService, private apiService: ApiService, private changeDetRef: ChangeDetectorRef, private http: HttpClient, private sessionService: SessionService, private location: Location, private toast: ToastService, private localStorage: LocalStorageService,
    private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
    this.sessionId = this.route.snapshot.paramMap.get('id')
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isSaved && this.createSession.myForm.dirty  || (this.imageChanged) ) {
      let dialog = this.dialog.open(ExitPopupComponent, {
        data: {
          header: "Exit this page?",
          label: "Are you sure you want to exit? your data will not be saved.",
          confirmButton: "EXIT",
          cancelButton: 'CANCEL'
        }
      })
      return dialog.afterClosed().pipe(
        map(((res) => {
            console.log(res)
            return res
          }))
      )
     } else {
       return true;
     }
   }
  ngOnInit(): void {
    if(this.sessionId){
      this.sessionDetailApi()
    }else {
      this.getFormDetails()
    }
  }
  getFormDetails(){
    this.form.getForm(CREATE_SESSION_FORM).subscribe((form)=>{
      this.formData = form;
      this.changeDetRef.detectChanges();
      if(this.sessionDetails){
        this.preFillData(this.sessionDetails);
        this.changeDetRef.detectChanges();
      }
    }) 
  }
 
  imageEvent(event: any) {
    if(event){
      this.localImage = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (file: any) => {
        this.imgData.image = file.target.result
        this.imgData.isUploaded = false;
        this.imageChanged = true
      }
      this.toast.showMessage("IMAGE_ADDED_SUCCESSFULLY", "success")
    } else {
      this.localImage = this.imgData.image = '';
      this.createSession.myForm.value.image = [];
      this.imgData.isUploaded = true;
      this.imageChanged = true
      this.toast.showMessage("IMAGE_REMOVED_SUCCESSFULLY", "success")
    }
  }

  onSubmit() {
    this.imageChanged = false;
    this.isSaved = true;
    if (this.createSession.myForm.valid) {
      if (this.imgData.image && !this.imgData.isUploaded) {
        this.getImageUploadUrl(this.localImage).subscribe()
      } else {
        const form = Object.assign({}, this.createSession.myForm.value);
        form.startDate = new Date(moment(form.startDate).seconds(0).toISOString()).getTime()/1000;
        form.endDate = new Date(moment(form.endDate).seconds(0).toISOString()).getTime()/1000;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        form.timeZone = timezone;
        this.createSession.myForm.markAsPristine();
        this.sessionService.createSession(form,this.sessionDetails?._id).subscribe((result)=>{
          result._id ? this.router.navigate([`/${"session-detail"}/${result._id}`], {replaceUrl: true}): this.location.back();
        });
      }
    }
  }
  getImageUploadUrl(file: any) {
    let config = {
      url: API_CONSTANTS.GET_IMAGE_UPLOAD_URL + file.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        return this.upload(file, result.result).subscribe(() => {
          this.imgData.isUploaded = true;
          this.createSession.myForm.value.image = result.result.filePath;
          this.onSubmit();
        })
      }))
  }
  upload(file: any, path: any) {
    var options = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    return this.http.put(path.signedUrl, file);
  }
  sessionDetailApi(){
    this.sessionService.getSessionDetailsAPI(this.sessionId).subscribe((response: any) =>{
      this.sessionDetails = response;
      this.getFormDetails()
    })
  }
  preFillData(existingData: any) {
    this.imgData.image = (existingData['image'][0]) ? existingData['image'][0] : '';
    for (let i = 0; i < this.formData.controls.length; i++) {
      this.formData.controls[i].value = (this.formData.controls[i].type == 'date')? moment.unix(existingData[this.formData.controls[i].name]).format():existingData[this.formData.controls[i].name];
      this.formData.controls[i].options = _.unionBy(this.formData.controls[i].options, this.formData.controls[i].value, 'value');
    }
  }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
