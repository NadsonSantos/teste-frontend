import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dev } from '../model/dev.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http: HttpClient) { }

  getList(): Dev[] {
    const list = localStorage.getItem('list');

    return list ? JSON.parse(list) : [];
  }

  setList(newList): void {
    localStorage.setItem('list', JSON.stringify(newList));
  }

  getDev(dev: string): any {
    return this.http.get('https://api.github.com/users/' + dev);
  }
}
