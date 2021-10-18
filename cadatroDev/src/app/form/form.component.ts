import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Dev } from '../model/dev.model';
import { ListService } from '../services/list.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public form: FormGroup;
  public showInputGit: boolean;
  public loading: boolean;
  public messageErr: boolean;
  public faCircleNotch = faCircleNotch;
  public faSpin = faSpinner;
  
  @Input('user') private user: Dev;
  @Output() private onSubmit: EventEmitter<Dev> = new EventEmitter<Dev>();
  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService) { }

  ngOnInit(): void {
    this.showInputGit = false;
    this.messageErr = false;
    this.loading = false;
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.user) {
      this.editForm();
    }
  }

  public imgErr(event: any): void {
    event.target.src = 'assets/Vector.svg';
  }

  public newDev(): void {
    const formValue = this.form.value;

    formValue.id = formValue.id || Math.random();
    this.form.reset();
    this.onSubmit.emit(formValue);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      userGit: [null],
      gitProfile: [null],
      id: [null],
      avatar: [null, Validators.required],
      name: [null, Validators.required],
      email: [null, Validators.required],
      city: [null, Validators.required],
      formation: [null, Validators.required],
      technology: [null, Validators.required]
    })

    this.form.controls.userGit.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      value => {
        this.loading = true;
        if (!value || value === '') {
          this.resetForm();
          this.loading = false;
          return;
        }

        this.listService.getDev(value).subscribe(
          data => {
            this.messageErr = false;
            this.form.patchValue({
              avatar: data.avatar_url,
              name: data.name,
              email: data.email,
              city: data.location,
              gitProfile: data.html_url
            })
            this.loading = false;
          },
          err => {
            this.resetForm();
            this.loading = false;
            this.messageErr = true;
          }
        )
      }
    )

    if (this.user) {
      this.editForm();
    }
  }

  private editForm(): void {
    this.form.patchValue({
      id: this.user.id,
      avatar: this.user.avatar,
      name: this.user.name,
      email: this.user.email,
      city: this.user.city,
      formation: this.user.formation,
      technology: this.user.technology,
      gitProfile: this.user.gitProfile || '',
    })
  }

  private resetForm(): void {
    this.form.patchValue({
      id: '',
      avatar: '',
      name: '',
      email: '',
      city: '',
      formation: '',
      technology: '',
      gitprofile: '',
    })
  }
}
