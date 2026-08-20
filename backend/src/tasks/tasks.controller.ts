import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-request.interface';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.tasksService.create(createTaskDto, user);
    return {
      success: true,
      message: 'Task created successfully',
      data,
    };
  }

  @Get()
  async findAll(@Query() filterDto: FilterTaskDto, @CurrentUser() user: AuthenticatedUser) {
    const { tasks, meta } = await this.tasksService.findAll(filterDto, user.userId);
    return {
      success: true,
      data: tasks,
      meta,
    };
  }

  @Get('stats')
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.tasksService.getStats(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.tasksService.findOne(id, user.userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.tasksService.update(id, updateTaskDto, user);
    return {
      success: true,
      message: 'Task updated successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.tasksService.remove(id, user.userId);
    return {
      success: true,
      message: result.message,
    };
  }
}
