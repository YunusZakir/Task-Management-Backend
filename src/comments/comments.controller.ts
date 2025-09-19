import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  list(@Param('taskId') taskId: string) {
    return this.comments.list(taskId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  add(@Param('taskId') taskId: string, @Body() body: { content: string }, @Req() req: any) {
    const authorId: string | null = req?.user?.id || null;
    return this.comments.add(taskId, authorId, body.content);
  }
}
