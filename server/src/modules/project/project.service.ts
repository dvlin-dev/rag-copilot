import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        project_detail: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profile: true,
          },
        },
      },
    });
  }

  getAll(user_id: string) {
    return this.prisma.project.findMany({
      where: {
        user_id,
      },
    });
  }

  create(createProjectDto: CreateProjectDto, user_id: string) {
    const { name, description, prompt, questions, white_list, ip_limit } =
      createProjectDto;
    const projectDetail = {
      prompt,
      questions,
      white_list,
      ip_limit: Number(ip_limit),
    };
    return this.prisma.project.create({
      data: {
        name,
        description,
        user_id,
        project_detail: {
          create: projectDetail,
        },
      },
    });
  }

  async update(updateProjectDto: UpdateProjectDto) {
    const { id, name, description, prompt, questions, white_list, ip_limit } =
      updateProjectDto;
    const projectDetail = {
      prompt,
      questions,
      white_list,
      ip_limit: Number(ip_limit),
    };
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        project_detail: {
          update: projectDetail,
        },
      },
      include: {
        project_detail: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
