import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  nullValidator?: boolean;
}
export interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}
interface JsonFormControls {
  name: string;
  label: string;
  value: string;
  type: string;
  class: string;
  position: string;
  disabled?: boolean;
  options?: JsonFormControlOptions;
  validators: JsonFormValidators;
  numberOfStars?:number;
  errorMessage?:string;
  dependentKey?:string;
  isNumberOnly?: boolean;
  placeHolder?:string;
}
export interface DynamicFormData {
  controls: JsonFormControls[];
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Output() onEnter = new EventEmitter();
  @Input() jsonFormData: any;
  @Input() uiConfig: any = {
    appearance: 'outline',
    floatLabel: 'auto'
  };
  textBoxTypes = ['email', 'number', 'text', 'password', 'search', 'tel', 'secretCode'];
  public myForm: FormGroup = this.fb.group({});
  showForm:boolean = false
  isScreenTouchable: boolean;
  deviceRegexp = /android|iphone|kindle|ipad/i;
  selectedChips: any;
  currentDate = new Date();
  maxDate = new Date(moment(this.currentDate).add(10, "years").format());
  dependedChild: any;
  dependedChildDate: any;
  dependedParent: any;
  dependedParentDate: any;

  constructor(private fb: FormBuilder,private toastService: ToastService,public dialog: MatDialog,private translate: TranslateService) { }


  ngOnInit() {
    this.isScreenTouchable = this.deviceRegexp.test(navigator.userAgent)
    this.jsonFormData.controls.find((element: any, index: number) => {
      if(element.type == "select"){
        this.jsonFormData.controls[index].options = _.sortBy(this.jsonFormData.controls[index].options, ['label']);
      }
    });
    setTimeout(() => {
      this.createForm(this.jsonFormData.controls);
      this.showForm = true;
    });
  }

  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }
      this.myForm.addControl(
        control.name,
        this.fb.control(
          { value: control.value, disabled: control.disabled || false },
          validatorsToAdd
        )
      );
    }
  }

  compareWith(a:any, b:any) {
    a = _.flatten([a]);
    b = _.flatten([b]);
    return JSON.stringify(a) == JSON.stringify(b);
  }
  
  onSubmit() {
    console.log(this.myForm.valid, this.myForm.value)
    this.isFormValid();
    this.onEnter.emit(this.isFormValid())
  }
  removeSpace(event: any){
    if(event.target.selectionStart === 0 && event.code === "Space"){
      event.preventDefault();
    }
  }
  
  reset() {
    this.myForm.reset();
  }

  isFormValid() {
    return this.myForm.statusChanges;
  }

  hideShowPassword(control:any) {
    control.type = control.type === 'text' ? 'password' : 'text';
    control.showPasswordIcon = true;
  }

  alertToast(control: any){
    let dialog = this.dialog.open(PopupDialogComponent, {
      data: control,
      position:{bottom: '50px', right:'20px'} 
    })
  }

  dateSelected(control:any, date:any) {
    if(control.dependedChild){
      this.dependedChild = control.dependedChild;
      this.dependedChildDate = new Date(date.value);
    } else {
      this.dependedParent = control.dependedParent
      this.dependedParentDate = new Date(date.value);
    }
  }
}
