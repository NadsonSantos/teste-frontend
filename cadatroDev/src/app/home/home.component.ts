import { Component, OnInit } from '@angular/core';
import { Dev } from '../model/dev.model';
import { ListService } from '../services/list.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public listDev: Dev[];
  public editDev: Dev;
  public loading: boolean;

  public faClose = faTrash;
  public faEdit = faEdit;
  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listDev = this.listService.getList();
    this.editDev = null;
    this.loading = false;
  }

  public onFilter(value: string): void {
    if (!value || value === '') {
      this.listDev = this.listService.getList();
    }


    this.listDev = this.listService.getList().filter(dev => {
      if (dev.technology.toLowerCase().includes(value)) return dev;
      if (dev.city.toLowerCase().includes(value)) return dev;
      if (dev.formation.toLowerCase().includes(value)) return dev;

    });
  }

  public onSubmit(value: Dev): void {
    console.log(value);

    if (!this.editDev) this.listDev.unshift(value);

    let index = this.listDev.findIndex(dev => dev.id === value.id);
    this.listDev[index] = value;
    
    this.listService.setList(this.listDev);
    this.editDev = null;
  }

  public deleteDev(index: number): void {
    if (confirm('Deseja excluir esse Dev ?'))

    this.listDev.splice(index, 1);

    this.listService.setList(this.listDev);
  }

  public onEditDev(dev: Dev): void {
    this.editDev = dev;
  }
}
