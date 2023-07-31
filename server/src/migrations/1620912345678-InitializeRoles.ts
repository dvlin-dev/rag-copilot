import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeRoles1620912345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(
      `INSERT INTO roles (id, name) VALUES (0, 'super'), (1, 'admin'), (2, 'user')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`DELETE FROM roles WHERE id IN (0, 1, 2)`);
  }
}
