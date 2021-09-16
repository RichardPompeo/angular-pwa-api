import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/UserModel';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]> | undefined;

  constructor(private register: RegisterService) {}

  // Quando carregar a página, busca os usuários
  ngOnInit(): void {
    this.users$ = this.register.list();
  }
}
