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
        projectDetail: true,
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

  getAll(userId: string) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  create(createProjectDto: CreateProjectDto, userId: string) {
    const { name, description, prompt, questions, whiteList, ipLimit } =
      createProjectDto;
    const projectDetail = {
      prompt,
      questions,
      whiteList,
      ipLimit: Number(ipLimit),
    };
    return this.prisma.project.create({
      data: {
        name,
        description,
        userId,
        projectDetail: {
          create: projectDetail,
        },
      },
    });
  }

  async update(updateProjectDto: UpdateProjectDto) {
    const { id, name, description, prompt, questions, whiteList, ipLimit } =
      updateProjectDto;
    const projectDetail = {
      prompt,
      questions,
      whiteList,
      ipLimit: Number(ipLimit),
    };
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        projectDetail: {
          update: projectDetail,
        },
      },
      include: {
        projectDetail: true,
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
