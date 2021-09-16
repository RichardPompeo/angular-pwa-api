import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/UserModel';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public user: User = new User();

  constructor(private register: RegisterService) {}

  // Registra um usuário
  public add(): void {
    this.user.id = this.user.name!.toLowerCase() + '-' + this.user.age;
    this.register.register(this.user);
  }

  ngOnInit(): void {}
}
