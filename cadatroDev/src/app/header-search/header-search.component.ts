import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';


@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css']
})
export class HeaderSearchComponent implements OnInit {
  public search: FormControl;

  @Output('value') value: EventEmitter<string> = new EventEmitter<string>();
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.search = this.formBuilder.control('');

    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      searchResult => this.value.emit(searchResult)
    )
  }

}
