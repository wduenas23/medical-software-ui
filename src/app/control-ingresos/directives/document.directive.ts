import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][duiMask]',
})
export class DocumentDirective {


  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: any) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: any) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event: any, backspace: any) {
    let newVal = event.replace(/\D/g, '')
    
    if (backspace && newVal.length <= 9) {
      newVal = newVal.substring(0, newVal.length - 1);
    }

    if (newVal.length === 0) {
      newVal = '';
    } else if(newVal.length === 9){
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
    }else{
      newVal = newVal.substring(0, 9);
    }
    
    this.ngControl.valueAccessor!.writeValue(newVal);
    
  }


}