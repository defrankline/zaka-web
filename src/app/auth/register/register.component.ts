import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Company, CompanyService} from '../../tenancy/company';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MemberRegistrationRequest} from '../member-registration-request';
import {ToastService} from '../../shared/services/toast.service';
import {PasswordValidator} from '../../shared/password-validator';
import {MemberTypeService} from '../../setup-and-configuration/membership/member-type/member-type.service';
import {MemberType} from '../../setup-and-configuration/membership/member-type/member-type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  title = 'Speedy Finances App';
  isLinear = true;
  errorMessage: string;
  storeSubscription: Subscription;
  demographicDataFormGroup: FormGroup;
  authenticationFormGroup: FormGroup;
  companyFormGroup: FormGroup;
  referencePersonFormGroup: FormGroup;
  acceptTermsFormGroup: FormGroup;
  company: Company;
  guarantorFormGroup: FormGroup;
  memberTypes: MemberType[];

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private toast: ToastService,
              private memberTypeService: MemberTypeService,
              private companyService: CompanyService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadMemberTypes();
    this.errorMessage = '';
    this.demographicDataFormGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      surname: ['', Validators.required],
      type: [null, Validators.required],
      gender: ['MALE', Validators.required],
    });
    this.companyFormGroup = this.formBuilder.group({
      company: ['', [Validators.required]],
    });

    this.guarantorFormGroup = this.formBuilder.group({
      guarantor1: ['', Validators.required],
      guarantor2: ['', Validators.required],
    });

    this.referencePersonFormGroup = this.formBuilder.group({
      referencePersonNumber: ['', [Validators.required]],
    });
    this.authenticationFormGroup = this.formBuilder.group({
      email: ['', [Validators.email]],
      username: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      password: [
        null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          PasswordValidator.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          PasswordValidator.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          PasswordValidator.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          PasswordValidator.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ],
      passwordConfirmation: [null, Validators.compose([Validators.required])],
    }, {
      validator: PasswordValidator.passwordMatchValidator
    });

    this.acceptTermsFormGroup = this.formBuilder.group({
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  loadMemberTypes(): void {
    this.memberTypeService.getAll().subscribe(response => {
      this.memberTypes = response.data;
    }, error => {
      this.toast.error('Error', 'Oops! Membership Types Could no be loaded!');
    });
  }

  public async register(companyData: any, demographicData: any, referencePersonData: any, guarantorData: any, authData: any): Promise<any> {
    const guarantor1 = guarantorData.guarantor1 as string;
    const guarantor2 = guarantorData.guarantor2 as string;
    const guarantorList = [];
    guarantorList.push(guarantor1);
    guarantorList.push(guarantor2);
    try {
      const data = {
        firstName: demographicData.firstName,
        middleName: demographicData.middleName,
        surname: demographicData.surname,
        username: authData.username,
        email: authData.email,
        mobile: authData.mobile,
        password: authData.password,
        company: companyData.company,
        type: demographicData.type as MemberType,
        acceptTerms: true,
        gender: demographicData.gender,
        guarantors: guarantorList,
        referencePersonNumber: referencePersonData.referencePersonNumber,
      } as MemberRegistrationRequest;
      const response = (await this.authService.register(data)) as any;
      if (response.status === 201) {
        this.toast.success('Success', 'Successfully Registered!. Login to continue!', 5000);
        const url = 'auth/login';
        await this.router.navigate([url]);
      } else {
        this.toast.error('Error', response.message, 5000);
      }
    } catch (e) {
      this.toast.error('Error', e.error.message, 5000);
    }
  }

  async resolveCompany(): Promise<any> {
    const companyNumber = this.companyFormGroup.get('company').value as string;
    try {
      const response = (await this.authService.resolveCompanyId(companyNumber)) as any;
      if (response.status === 200) {
        this.company = response.data as Company;
      } else {
        this.toast.error('Error', response.message, 5000);
      }
    } catch (e) {
      console.error('Error during company data request', e);
      this.toast.error('Error', e.error.message, 5000);
    }
  }

  setEmail(): void {
    const firstName = this.demographicDataFormGroup.get('firstName').value as string;
    const middleName = this.demographicDataFormGroup.get('middleName').value as string;
    const surname = this.demographicDataFormGroup.get('surname').value as string;
    const name = firstName.toLowerCase() + '.' + middleName.toLowerCase() + '.' + surname.toLowerCase();
    const username = name.trim().replace(' ', '') + '@' + this.company.name.toLowerCase().trim().replace(' ', '') + '.com';
    this.authenticationFormGroup.get('email').setValue(username);
    this.authenticationFormGroup.get('username').setValue(username);
  }

  trackTypeId(index: number, item: MemberType): number {
    return item.id;
  }
}
