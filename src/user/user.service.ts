import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, ILike, Not, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import moment from 'moment';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserDto> {
    const user = await this.repository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'dateOfBirth', 'username'],
    });

    return { ...user, age: this.calculateAge(user.dateOfBirth) };
  }

  async findAll({
    firstName,
    lastName,
    age,
    userId,
  }: FindAllUserDto): Promise<UserDto[]> {
    const queryOptions: FindManyOptions<UserEntity> = {
      where: { id: Not(userId) },
    };

    if (firstName) {
      queryOptions.where = {
        firstName: ILike(`%${firstName}%`),
      };
    }

    if (lastName) {
      queryOptions.where = {
        ...queryOptions.where,
        lastName: ILike(`%${lastName}%`),
      };
    }

    if (age) {
      const { minBirthDate, maxBirthDate } = this.calculateBirthYearRange(age);
      queryOptions.where = {
        ...queryOptions.where,
        dateOfBirth: Between(minBirthDate, maxBirthDate),
      };
    }

    queryOptions.select = [
      'id',
      'firstName',
      'lastName',
      'dateOfBirth',
      'username',
    ];

    const entities = await this.repository.find(queryOptions);
    const result: UserDto[] = [];
    entities.forEach((entity) => {
      const dto = new UserDto();
      dto.id = entity.id;
      dto.firstName = entity.firstName;
      dto.lastName = entity.lastName;
      dto.dateOfBirth = entity.dateOfBirth;
      dto.username = entity.username;
      dto.age = this.calculateAge(entity.dateOfBirth);
      result.push(dto);
    });

    return result;
  }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return this.repository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    await this.repository.update({ id }, dto);
    return this.findById(id);
  }

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<UserDto> {
    const user = await this.repository.findOne({ where: { username } });

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Login failed!');
    }

    return user;
  }
  calculateBirthYearRange(age: number) {
    const maxBirthDate = moment().subtract(age, 'years');
    const minBirthDate = moment(maxBirthDate).subtract(1, 'year');
    return {
      minBirthDate: minBirthDate.toDate(),
      maxBirthDate: maxBirthDate.toDate(),
    };
  }

  calculateAge(dateOfBirth: Date) {
    return moment().diff(moment(dateOfBirth), 'years');
  }
}
