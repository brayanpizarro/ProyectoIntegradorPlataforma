import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Seeder } from '../interfaces/seeder.interface';
import { usersData } from '../data/users.data';

@Injectable()
export class UserSeeder implements Seeder {
  name = 'UserSeeder';

  constructor(private readonly usersService: UsersService) {}

  async run(): Promise<number> {
    console.log(`📝 Ejecutando ${this.name}...`);
    let created = 0;

    for (const userData of usersData) {
      try {
        const existing = await this.usersService.findByEmail(userData.email);
        if (existing) {
          console.log(` Usuario ${userData.email} ya existe, saltando...`);
          continue;
        }
      } catch {
        await this.usersService.create(userData as CreateUserDto);
        console.log(` Usuario creado: ${userData.email} (${userData.rol})`);
        created++;
      }
    }

    console.log(`${this.name} completado: ${created} registros creados\n`);
    return created;
  }
}
