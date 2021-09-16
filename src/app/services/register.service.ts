import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Dexie from 'dexie';

import { User } from '../models/UserModel';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private API: String = 'http://137.184.108.150:3000';
  private db!: Dexie;
  private table!: Dexie.Table<User, any>;

  constructor(private http: HttpClient, private connection: ConnectionService) {
    this.startIndexedDB();
    this.listenStatusConnection();
  }

  // Escuta os eventos do Connection Service
  private listenStatusConnection(): void {
    this.connection.statusConnection.subscribe((online) => {
      if (online) {
        alert(
          'A conexão com a internet voltou, todos os usuários serão salvos.'
        );
        // Se tiver internet, salva tudo que está na IndexedDB pra API
        this.saveIndexedDBtoAPI();
      } else {
        alert(
          'Sem acesso a internet, todos os usuários serão cadastrados quando a internet for recuperada.'
        );
      }
    });
  }

  // Inicia a tabela do IndexedDB
  private startIndexedDB(): void {
    this.db = new Dexie('users');

    this.db.version(1).stores({
      user: 'id',
    });

    this.table = this.db.table('user');
  }

  // Pega todos os usuários da IndexedDB e envia pra API
  private async saveIndexedDBtoAPI(): Promise<void> {
    const users: User[] = await this.table.toArray();

    for (const user of users) {
      await this.addToAPI(user);
      await this.table.delete(user.id);
    }
  }

  // Adiciona um usuário na API
  private addToAPI(user: User): any {
    return this.http.post(this.API + '/users', user).subscribe(
      () => {
        alert('Usuário cadastrado com sucesso na API');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Adiciona um usuário na IndexedDB
  private async addToIndexedDB(user: User): Promise<void> {
    try {
      await this.table.add(user);
      alert(
        'Usuário cadastrado com sucesso na IndexedDB, os usuários serão cadastrados na API assim que houver conexão com a internet.'
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Registra um usuário
  public register(user: User): any {
    if (this.connection.isOnline) {
      // Se tiver internet, chama o método de adicionar na API
      this.addToAPI(user);
    } else {
      // Caso contrário, chama o método de adicionar na IndexedDB
      this.addToIndexedDB(user);
    }
  }

  // Lista os usuários
  public list(): any {
    return this.http.get(this.API + '/users');
  }
}
