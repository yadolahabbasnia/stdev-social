import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/user-login-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //Register controller
  @ApiOperation({
    description: 'User can register here',
    summary: 'User registration',
  })
  @ApiResponse({ status: 201, description: 'User created' })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  //Login controller
  @ApiOperation({
    description: 'User can login here',
    summary: 'User login',
  })
  @ApiResponse({
    status: 200,
    description: 'User created',
    type: UserLoginResponseDto,
  })
  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<UserLoginResponseDto> {
    return this.authService.login(user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    description: 'User can users list here',
    summary: 'Users list',
  })
  @ApiResponse({
    status: 200,
    description: 'Users list',
    type: [UserDto],
  })
  findAll(
    @Query() query: FindAllUserDto,
    @Req() req: Request,
  ): Promise<UserDto[]> {
    const user = req['user'];
    return this.userService.findAll({ ...query, userId: user.id });
  }

  //User Detail controller
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    description: 'User can view profile here',
    summary: 'Get user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: UserDto,
  })
  findOne(@Req() req: Request): Promise<UserDto> {
    const user: UserDto = req['user'];
    return this.userService.findById(user.id);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'User can update profile here and it can be partially of user profile',
    summary: 'Update user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user: UserDto = req['user'];
    return this.userService.update(user.id, dto);
  }
}
