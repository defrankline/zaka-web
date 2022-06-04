import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CustomResponse} from "../custom-response";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toast: ToastrService) {
  }

  success(title: string, message: string, timeout: number = 5000): any {
    return this.toast.success(message, title, {timeOut: timeout});
  }

  warning(title: string, message: string, timeout: number = 5000): any {
    return this.toast.warning(message, title, {timeOut: timeout});
  }

  error(title: string, message: string, timeout: number = 5000): any {
    return this.toast.error(message, title, {timeOut: timeout});
  }

  show(resonse: CustomResponse, timeout = 5000): any {
    return this.toast.success(resonse.message, 'Success', {timeOut: timeout});
  }

}
